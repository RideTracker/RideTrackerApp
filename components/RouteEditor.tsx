import React, { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { View, LayoutRectangle, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from "./FormInput";
import { FontAwesome, FontAwesome5, Entypo } from "@expo/vector-icons";
import { useTheme } from "../utils/themes";
import { SearchPrediction } from "../models/SearchPrediction";
import { getMapsGeocode, getMapsRoutes, getMapsSearchPredictions } from "@ridetracker/ridetrackerclient";
import { useClient } from "../modules/useClient";
import { RouteWaypoint } from "../app/(root)/(auth)/(tabs)/(subscription)/routes";
import { LocationObject } from "expo-location";
import { useDispatch } from "react-redux";
import { addSearchPrediction } from "../utils/stores/searchPredictions";
import { CaptionText } from "./texts/Caption";
import { useSearchPredictions } from "../modules/usePlacesHistory";
import { ParagraphText } from "./texts/Paragraph";
import GoogleMapsLogo from "./maps/GoogleMapsLogo";
import Button from "./Button";
import MapView from "react-native-maps";
import { HeaderText } from "./texts/Header";
import getFormattedDuration from "../controllers/getFormattedDuration";
import getDurationAsNumber from "../controllers/getDurationAsNumber";
import getGoogleMapsDirectionsUrl from "../controllers/getGoogleMapsDirectionsUrl";
import DrawingOverlay, { DrawingPolyline, DrawingState } from "./DrawingOverlay";
import { decode } from "@googlemaps/polyline-codec";

export type RouteEditorProps = {
    routeId?: string;
    children: ReactNode;
    mapRef: React.MutableRefObject<MapView>;
    mapLayout: LayoutRectangle;
    initialLocation: LocationObject;
    waypoints: RouteWaypoint[];
    routes: {
        polyline: { latitude: number; longitude: number; }[];
        distance: number;
        duration: string;
    };
    onDrawingPolyline: (drawingPolyline: DrawingPolyline) => void;
    onWaypoints: (waypoints: RouteWaypoint[]) => void;
    onSearchLayout: (rectangle: LayoutRectangle) => void;
    onWaypointsLayout: (rectangle: LayoutRectangle) => void;
    onSave: () => void;
    onActive?: (active: boolean) => void;
};

export default function RouteEditor({ routeId, children, mapRef, mapLayout, initialLocation, waypoints, routes, onDrawingPolyline, onWaypoints, onSearchLayout, onWaypointsLayout, onSave, onActive }: RouteEditorProps) {
    const theme = useTheme();
    const client = useClient();
    const dispatch = useDispatch();
    const searchPredictionsHistory = useSearchPredictions();

    const searchRef = useRef<TextInput>();

    const [ pointing, setPointing ] = useState<boolean>(false);
    const [ drawing, setDrawing ] = useState<boolean>(false);
    const [ sorting, setSorting ] = useState<boolean>(false);
    const [ searchFocus, setSearchFocus ] = useState<boolean>(false);
    const [ searchLayout, setSearchLayout ] = useState<LayoutRectangle>(null);
    const [ searchText, setSearchText ] = useState<string>("");
    const [ searchTimeout, setSearchTimeout ] = useState<NodeJS.Timeout>(null);
    const [ searchPredictions, setSearchPredictions ] = useState<SearchPrediction[]>([]);

    useEffect(() => {
        if(searchTimeout)
            clearInterval(searchTimeout);

        if(!searchText.length) {
            setSearchTimeout(null);
            setSearchPredictions([]);

            return;
        }

        setSearchTimeout(setTimeout(() => {
            setSearchTimeout(null);

            getMapsSearchPredictions(client, searchText).then((result) => {
                if(!result.success)
                    return;

                if(!result.predictions.length)
                    return;
    
                setSearchPredictions(result.predictions.map((prediction) => {
                    return {
                        name: prediction.structured_formatting.main_text,
                        description: prediction.structured_formatting.secondary_text,
                        placeId: prediction.place_id
                    };
                }));
            });
        }, 500));
    }, [ searchText ]);

    useEffect(() => {
        onActive(pointing || drawing || searchFocus);
    }, [ pointing, drawing, searchFocus ]);

    const handleSearchPlace = useCallback((searchPrediction: SearchPrediction) => {
        if(!searchPrediction.location && searchPrediction.placeId) {
            getMapsGeocode(client, searchPrediction.placeId).then((result) => {
                if(!result.success)
                    return;

                searchRef.current.blur();

                if(!result.places.length)
                    return;

                let newWaypoints = waypoints;

                if(newWaypoints.length === 0 && initialLocation) {
                    newWaypoints = [
                        {
                            type: "SEARCH_PREDICTION",
                            searchPrediction: {
                                name: "Your location",
                                location: {
                                    latitude: initialLocation.coords.latitude,
                                    longitude: initialLocation.coords.longitude
                                }
                            }
                        }
                    ];
                }

                searchPrediction.location = result.places[0].location;

                newWaypoints.push({
                    type: "SEARCH_PREDICTION",
                    searchPrediction
                });

                dispatch(addSearchPrediction(searchPrediction));

                onWaypoints(newWaypoints);
                
                setSearchPredictions([]);
                searchRef.current.clear();
            });
        }
        else if(searchPrediction.location) {
            searchRef.current.blur();

            let newWaypoints = waypoints;

            if(newWaypoints.length === 0 && initialLocation) {
                newWaypoints = [
                    {
                        type: "SEARCH_PREDICTION",
                        searchPrediction: {
                            name: "Your location",
                            location: {
                                latitude: initialLocation.coords.latitude,
                                longitude: initialLocation.coords.longitude
                            }
                        }
                    }
                ];
            }
            
            newWaypoints.push({
                type: "SEARCH_PREDICTION",
                searchPrediction
            });

            onWaypoints(newWaypoints);
            
            setSearchPredictions([]);
            searchRef.current.clear();
        }
    }, [ client, searchRef, initialLocation, waypoints ]);

    const handleDrawingUpdate = useCallback((state: DrawingState, polyline: DrawingPolyline) => {
        if(state === "POLYLINE_UPDATE") 
            onDrawingPolyline(polyline);
        else if(state === "POLYLINE_FINISH") {
            setDrawing(false);

            getMapsRoutes(client, polyline).then((result) => {
                const route = result.routes[0];

                const newWaypoints = waypoints;

                newWaypoints.push({
                    type: "PATH",
                    path: {
                        distance: route.distance,
                        duration: route.duration,
                        original: polyline,
                        route: decode(result.routes[0].polyline).map((coordinate) => {
                            return {
                                latitude: coordinate[0],
                                longitude: coordinate[1]
                            };
                        })
                    }
                });
    
                onWaypoints(newWaypoints);

                onDrawingPolyline(null);
            });
        }

    }, [ waypoints ]);

    return (
        <React.Fragment>
            {(drawing) && (<DrawingOverlay mapRef={mapRef} onUpdate={handleDrawingUpdate}/>)}

            {(pointing) && (
                <View style={{
                    position: "absolute",

                    left: "50%",
                    top: "50%"
                }}>
                    <View style={{
                        width: 60,
                        height: 60,

                        justifyContent: "flex-end",
                        alignItems: "center",

                        marginLeft: -30,
                        marginTop: -60
                    }}>
                        <FontAwesome5 name="map-pin" size={40} color={theme.color}/>
                    </View>
                </View>
            )}

            {(searchFocus) && (
                <TouchableWithoutFeedback onPress={() => { searchRef.current.blur() }}>
                    <View style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%",

                        backgroundColor: "rgba(0, 0, 0, .75)"
                    }}/>
                </TouchableWithoutFeedback>
            )}

            <SafeAreaView edges={[ "top" ]} style={{ padding: 10 }} onLayout={(event) => {
                if(!searchFocus) {
                    setSearchLayout(event.nativeEvent.layout);
                    onSearchLayout(event.nativeEvent.layout);
                }
            }}>
                {(!drawing && !pointing) && (
                    <FormInput inputRef={searchRef} borderRadius={20} placeholder="Search for a place..." icon={
                        <FontAwesome name="search" size={24} color={theme.color}/>
                    } props={{
                        onChangeText: (text) => setSearchText(text),
                        onFocus: () => setSearchFocus(true),
                        onBlur: () => setSearchFocus(false)
                    }}></FormInput>
                )}

                {(searchFocus) && (
                    <View style={{ paddingVertical: 10 }}>
                        <View style={{ gap: 10 }}>
                            {(!searchPredictions.length && initialLocation) && (
                                <TouchableOpacity onPress={() => {
                                    handleSearchPlace({
                                        location: {
                                            latitude: initialLocation.coords.latitude,
                                            longitude: initialLocation.coords.longitude
                                        },
                                        name: "Your location"
                                    });
                                }}>
                                    <View style={{ flexDirection: "row", gap: 10 }}>
                                        <View style={{
                                            backgroundColor: "rgba(255, 255, 255, .2)",
                                            borderRadius: 24,

                                            width: 38,
                                            height: 38,

                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <FontAwesome5 name={"map-marker-alt"} size={22} color={"white"}/>
                                        </View>

                                        <View style={{ justifyContent: "space-evenly" }}>
                                            <CaptionText style={{ color: "white" }}>Your location</CaptionText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            
                            {((searchPredictions.concat(searchPredictionsHistory.slice(0, Math.max(Math.min(5 - searchPredictions.length, searchPredictionsHistory.length), 0))))).map((prediction, index) => (
                                <TouchableOpacity key={index} onPress={() => {
                                    handleSearchPlace(prediction);
                                }}>
                                    <View style={{ flexDirection: "row", gap: 10 }}>
                                        <View style={{
                                            backgroundColor: "rgba(255, 255, 255, .2)",
                                            borderRadius: 24,

                                            width: 38,
                                            height: 38,

                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <FontAwesome5 name={(prediction.location)?("history"):("map-marker-alt")} size={(prediction.location)?(22):(24)} color={"white"}/>
                                        </View>

                                        <View style={{ justifyContent: "space-evenly" }}>
                                            <CaptionText style={{ color: "white" }}>{prediction.name}</CaptionText>

                                            {(prediction.description) && (
                                                <ParagraphText style={{ color: "white" }}>{prediction.description}</ParagraphText>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </SafeAreaView>


            <View style={{
                width: "100%",

                position: "absolute",

                bottom: 0,
                left: 0,
            }}>
                {(!drawing && !pointing) && (<GoogleMapsLogo/>)}

                {(!searchFocus) && (
                    (!drawing)?(
                        (!pointing)?(
                            <ScrollView horizontal={true}>
                                <View style={{
                                    padding: 5,
                                    gap: 10,
                                    flexDirection: "row"
                                }}>
                                    <TouchableOpacity style={{
                                        gap: 10,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: theme.background,
                                        padding: 10,
                                        borderRadius: 10
                                    }} onPress={() => {
                                        setDrawing(true);
                                    }}>
                                        <Entypo name="brush" size={20} color={theme.color}/>

                                        <CaptionText>Draw a path</CaptionText>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        gap: 10,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: theme.background,
                                        padding: 10,
                                        borderRadius: 10
                                    }} onPress={() => {
                                        setPointing(true);
                                    }}>
                                        <FontAwesome5 name="map-pin" size={20} color={theme.color}/>

                                        <CaptionText>Add waypoints</CaptionText>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        ):(
                            <View style={{
                                padding: 10,
                                flexDirection: "column",
                                gap: 10
                            }}>
                                <Button primary={false} type="overlay-stroke" label="Add waypoint" onPress={() => {
                                    mapRef.current.coordinateForPoint({
                                        x: Math.round(mapLayout.width / 2),
                                        y: Math.round(mapLayout.height / 2)
                                    }).then((coordinate) => {
                                        setPointing(false);

                                        onWaypoints(waypoints.concat({
                                            type: "SEARCH_PREDICTION",
                                            searchPrediction: {
                                                name: "Custom waypoint",
                                                location: coordinate
                                            }
                                        }));
                                    });
                                }}/>
                                
                                <Button primary={false} type="danger" label="Cancel" onPress={() => setPointing(false)}/>
                            </View>
                        )
                    ):(
                        <Button primary={false} type="danger" label="Cancel drawing" onPress={() => setDrawing(false)}/>
                    )
                )}

                {(!!waypoints.length && !searchFocus && !drawing && !pointing) && (
                    <View style={{
                        backgroundColor: theme.background,

                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,

                        padding: 10,
                        gap: 10
                    }} onLayout={(event) => onWaypointsLayout(event.nativeEvent.layout)}>
                        {(!!waypoints.length && routes) && (
                            <View style={{ flexDirection: "row" }}>
                                <HeaderText>Est. {getFormattedDuration(getDurationAsNumber(routes.duration))}</HeaderText>

                                <HeaderText style={{ color: "grey" }}> ({Math.round(routes.distance / 1000) + " km"})</HeaderText>
                            </View>
                        )}

                        <ScrollView style={{ paddingBottom: 10, maxHeight: 180 }}>
                            <View style={{ gap: 10, position: "relative" }}>
                                {waypoints.map((waypoint, index) => (
                                    <TouchableWithoutFeedback key={index} onLongPress={() => {
                                        setSorting(true);
                                    }}>
                                        <View style={{ flexDirection: "row", gap: 10 }}>
                                            <View style={{
                                                justifyContent: "center",
                                                alignItems: "center",

                                                width: 32,

                                                position: "relative"
                                            }}>
                                                <FontAwesome5 name={(index === (waypoints.length - 1) && index !== 0)?("flag-checkered"):("map-marker-alt")} size={24} color={theme.color}/>

                                                {(index !== waypoints.length - 1) && (
                                                    <Entypo name="dots-three-vertical" size={20} color={theme.color} style={{ marginBottom: -25, marginTop: 5 }}/>
                                                )}
                                            </View>

                                            <View style={{ flexGrow: 1 }}>
                                                <FormInput value={(waypoint.type === "SEARCH_PREDICTION")?(waypoint.searchPrediction.name):("Custom path")} iconRight={(
                                                    (!sorting)?(
                                                        <TouchableOpacity style={{
                                                            flexGrow: 1,

                                                            justifyContent: "center",
                                                            alignItems: "center"
                                                        }} onPress={() => {
                                                            onWaypoints(waypoints.filter((_, itemIndex) => itemIndex !== index));
                                                        }}>
                                                            <FontAwesome5 name={"times"} size={24} color={theme.color}/>
                                                        </TouchableOpacity>
                                                    ):(
                                                        <View style={{
                                                            flexGrow: 1,
                                                            flexDirection: "column"
                                                        }}>
                                                            <TouchableOpacity disabled={index === 0} style={{
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }} onPress={() => {
                                                                const newWaypoints = [ ...waypoints ];
                                                                newWaypoints.splice(index, 0, newWaypoints.splice(index - 1, 1)[0]);

                                                                onWaypoints(newWaypoints);
                                                            }}>
                                                                <FontAwesome5 name={"caret-up"} size={12} color={(index === 0)?("grey"):(theme.color)}/>
                                                            </TouchableOpacity>
                                                            
                                                            <TouchableOpacity disabled={index === waypoints.length - 1} style={{
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }} onPress={() => {
                                                                const newWaypoints = [ ...waypoints ];
                                                                newWaypoints.splice(index, 0, newWaypoints.splice(index + 1, 1)[0]);

                                                                onWaypoints(newWaypoints);
                                                            }}>
                                                                <FontAwesome5 name={"caret-down"} size={12} color={(index === waypoints.length - 1)?("grey"):(theme.color)}/>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                )} props={{
                                                    editable: false
                                                }}/>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}
                            </View>
                        </ScrollView>

                        {(!!waypoints.length) && (
                            (!sorting)?(
                                /*<Button primary={true} label="Open in Google Maps" onPress={() => {
                                    Linking.openURL(getGoogleMapsDirectionsUrl(waypoints));
                                }}/>*/
                                <React.Fragment>
                                    {(routeId)?(
                                        <Button primary={true} label="Update route" onPress={() => {
                                            onSave();
                                        }}/>
                                    ):(
                                        <Button primary={true} label="Save route" onPress={() => {
                                            onSave();
                                        }}/>
                                    )}
                                        
                                    {/*<Button primary={false} type="danger" label="Cancel" onPress={() => {
                                        Alert.alert("Are you sure?", "Your changes will not be saved.", [
                                            {
                                                style: "cancel",
                                                text: "Cancel"
                                            },

                                            {
                                                style: "destructive",
                                                text: "I am sure"
                                            }
                                        ])
                                    }}/>*/}
                                </React.Fragment>
                            ):(
                                <Button primary={false} label="Save order" onPress={() => {
                                    setSorting(false);
                                }}/>
                            )
                        )}
                    </View>
                )}

                {(!drawing && !pointing && !searchFocus) && (children)}
            </View>
        </React.Fragment>
    );
};
