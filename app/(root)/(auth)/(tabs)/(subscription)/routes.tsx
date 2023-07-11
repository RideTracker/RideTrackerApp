import { useState, useEffect, useRef, useCallback } from "react";
import { LayoutRectangle, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useMapStyle, useTheme } from "../../../../../utils/themes";
import MapView, { Marker, PanDragEvent, Polyline } from "react-native-maps";
import { HeaderText } from "../../../../../components/texts/Header";
import * as Location from "expo-location";
import { FontAwesome, FontAwesome5, Entypo } from "@expo/vector-icons";
import FormInput from "../../../../../components/FormInput";
import { getMapsGeocode, getMapsRoutes, getMapsSearchPredictions } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../../modules/useClient";
import { CaptionText } from "../../../../../components/texts/Caption";
import { ParagraphText } from "../../../../../components/texts/Paragraph";
import { useUser } from "../../../../../modules/user/useUser";
import { useDispatch } from "react-redux";
import { useSearchPredictions } from "../../../../../modules/usePlacesHistory";
import { addSearchPrediction } from "../../../../../utils/stores/searchPredictions";
import { SearchPrediction } from "../../../../../models/SearchPrediction";
import { decode } from "@googlemaps/polyline-codec";
import GoogleMapsLogo from "../../../../../components/maps/GoogleMapsLogo";
import MapRouteMarkers from "../../../../../components/maps/MapRouteMarkers";
import getFormattedDuration from "../../../../../controllers/getFormattedDuration";
import getDurationAsNumber from "../../../../../controllers/getDurationAsNumber";
import Button from "../../../../../components/Button";
import * as Linking from "expo-linking";
import getGoogleMapsDirectionsUrl from "../../../../../controllers/getGoogleMapsDirectionsUrl";
import MapStartMarker from "../../../../../components/maps/MapStartMarker";
import MapFinishMarker from "../../../../../components/maps/MapFinishMarker";
import MapIntermediateMarker from "../../../../../components/maps/MapIntermediateMarker";
import OfflinePageOverlay from "../../../../../components/OfflinePageOverlay";
import useInternetConnection from "../../../../../modules/useInternetConnection";
import SubscriptionPageOverlay from "../../../../../components/SubscriptionPageOverlay";
import PermissionsPageOverlay from "../../../../../components/PermissionsPageOverlay";
import PageOverlay from "../../../../../components/PageOverlay";

global.coordinates = [];

export default function Routes() {
    const client = useClient();
    const theme = useTheme();
    const mapStyle = useMapStyle();
    const router = useRouter();
    const userData = useUser();
    const searchPredictionsHistory = useSearchPredictions();
    const dispatch = useDispatch();
    const internetConnection = useInternetConnection();

    const mapRef = useRef<MapView>();
    const searchRef = useRef<TextInput>();

    const [ focus, setFocus ] = useState<boolean>(false);
    const [ initialLocation, setInitialLocation ] = useState(null);
    const [ searchFocus, setSearchFocus ] = useState<boolean>(false);
    const [ searchText, setSearchText ] = useState<string>("");
    const [ searchTimeout, setSearchTimeout ] = useState<NodeJS.Timeout>(null);
    const [ searchPredictions, setSearchPredictions ] = useState<SearchPrediction[]>([]);
    const [ searchLayout, setSearchLayout ] = useState<LayoutRectangle>(null);
    const [ waypoints, setWaypoints ] = useState<SearchPrediction[]>([]);
    const [ waypointsLayout, setWaypointsLayout ] = useState<LayoutRectangle>(null);
    const [ routes, setRoutes ] = useState<{
        polyline: { latitude: number; longitude: number; }[];
        distance: number;
        duration: string;
    }[]>([]);
    const [ sorting, setSorting ] = useState<boolean>(false);
    const [ drawing, setDrawing ] = useState<boolean>(false);
    const [ permissions, setPermissions ] = useState<Location.LocationPermissionResponse>(null);
    const [ drawingTimestamp, setDrawingTimestamp ] = useState<number>(0);

    useFocusEffect(() => {
        setFocus(true);

        return () => setFocus(false);
    });

    useEffect(() => {
        Location.getForegroundPermissionsAsync().then((permissions) => {
            setPermissions(permissions);
        });
    }, []);

    useEffect(() => {
        if(permissions?.granted) {
            Location.getCurrentPositionAsync().then((location) => {
                setInitialLocation(location);
    
                mapRef.current.setCamera({
                    zoom: 12,
                    
                    center: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }
                });
            });
        }
    }, [ permissions ]);

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
                console.log({ result });
    
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
                            name: "Your location",
                            location: {
                                latitude: initialLocation.coords.latitude,
                                longitude: initialLocation.coords.longitude
                            }
                        }
                    ];
                }

                searchPrediction.location = result.places[0].location;

                newWaypoints.push(searchPrediction);

                dispatch(addSearchPrediction(searchPrediction));

                setWaypoints(newWaypoints);
                
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
                        name: "Your location",
                        location: {
                            latitude: initialLocation.coords.latitude,
                            longitude: initialLocation.coords.longitude
                        }
                    }
                ];
            }
            
            newWaypoints.push(searchPrediction);

            setWaypoints(newWaypoints);
            
            setSearchPredictions([]);
            searchRef.current.clear();
        }
    }, [ client, searchRef, initialLocation ]);

    useEffect(() => {
        if(waypoints.length >= 2) {
            getMapsRoutes(client, waypoints.map((waypoint) => waypoint.location)).then((result) => {
                setRoutes(result.routes.map((route) => {
                    return {
                        polyline: decode(route.polyline, 5).map((coordinate) => {
                            return {
                                latitude: coordinate[0],
                                longitude: coordinate[1]
                            };
                        }),
                        duration: route.duration,
                        distance: route.distance
                    };
                }));
            })
        }
    }, [ waypoints.length ]);

    useEffect(() => {
        if(waypoints.length && waypointsLayout) {
            mapRef.current.fitToCoordinates(waypoints.flatMap((waypoint) => waypoint.location), {
                animated: true,
                edgePadding: {
                    left: 40,
                    top: 10 + ((searchLayout)?(searchLayout.y + searchLayout.height):(0)),
                    right: 40,
                    bottom: 10 + 40 + ((waypointsLayout)?(waypointsLayout.height):(0))
                }
            });
        }
    }, [ waypointsLayout?.height, waypoints.length ]);

    useEffect(() => {
        if(drawing) {
            const timer = setInterval(() => {
                setDrawingTimestamp(Date.now());
            }, 30);

            return () => {
                clearInterval(timer);
            };
        }
    }, [ drawing ]);

    return (
        <View style={{ flex: 1, position: "relative", backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Routes",
                headerTransparent: true,
                /*headerRight: () => (
                    <View style={{ marginRight: 20 }}>
                        <TouchableOpacity>
                            <FontAwesome name="plus" size={24} color={theme.color}/>
                        </TouchableOpacity>
                    </View>
                )*/
            }} />

            {(focus) && (
                <TouchableWithoutFeedback style={{
                    position: "absolute",

                    width: "100%",
                    height: "100%",

                    left: 0,
                    bottom: 0
                }} onPressIn={() => {
                    //setDrawing(true);

                    //global.coordinates = [];
                }} onPressOut={() => {
                    //setDrawing(false);
                }}>
                    <MapView
                        ref={mapRef}
                        provider={userData.mapProvider}
                        showsUserLocation={false}
                        style={{
                            position: "absolute",

                            width: "100%",
                            height: "100%",

                            left: 0,
                            bottom: 0
                        }}
                        scrollEnabled={!drawing}
                        onPanDrag={(event) => {
                            if(drawing) {
                                global.coordinates = global.coordinates.concat(event.nativeEvent.coordinate);
                            }
                        }}
                        customMapStyle={(waypoints.length < 2)?(theme.mapStyle):(theme.mapStyle.concat(mapStyle.compact))}
                        >
                        {(waypoints.length > 1) && routes.map((route, index) => (
                            <Polyline key={index} coordinates={route.polyline} fillColor={"white"} strokeColor={"white"} strokeWidth={4}/>                    
                        ))}

                        <Polyline coordinates={[...global.coordinates]} fillColor={theme.brand} strokeColor={theme.brand} strokeWidth={4} lineJoin={"round"}/>

                        <MapRouteMarkers waypoints={waypoints}/>

                        {/*waypoints.map((waypoint, index) => (
                            <Marker key={index} coordinate={waypoint.location} pinColor={getWaypointColor(index, waypoints.length)}/>
                        ))*/}
                    </MapView>
                </TouchableWithoutFeedback>
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

            <View style={{
                marginTop: 90,

                padding: 10
            }} onLayout={(event) => {
                if(!searchFocus)
                    setSearchLayout(event.nativeEvent.layout);
            }}>
                <FormInput inputRef={searchRef} borderRadius={20} placeholder="Search for a place..." icon={
                    <FontAwesome name="search" size={24} color={theme.color}/>
                } props={{
                    onChangeText: (text) => setSearchText(text),
                    onFocus: () => setSearchFocus(true),
                    onBlur: () => setSearchFocus(false)
                }}></FormInput>

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
            </View>

            {(!initialLocation && permissions?.granted) && (
                <View style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%",

                    backgroundColor: "rgba(0, 0, 0, .6)",

                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <HeaderText style={{ color: "white" }}>Getting your location...</HeaderText>
                </View>
            )}

            {(!!waypoints.length && !searchFocus) && (
                <View style={{
                    backgroundColor: theme.background,

                    width: "100%",

                    position: "absolute",

                    bottom: 0,
                    left: 0,

                    padding: 10,
                    gap: 10,

                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }} onLayout={(event) => {
                    setWaypointsLayout(event.nativeEvent.layout);
                }}>
                    <GoogleMapsLogo style={{
                        position: "absolute",
                        top: -25
                    }}/>

                    {(routes.length > 0) && (
                        <View style={{ flexDirection: "row" }}>
                            <HeaderText>Est. {getFormattedDuration(getDurationAsNumber(routes.flatMap((route) => route.duration)))}</HeaderText>

                            <HeaderText style={{ color: "grey" }}> ({routes.flatMap((route) => Math.round(route.distance / 1000) + " km").join(', ')})</HeaderText>
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
                                            <FormInput value={waypoint.name} iconRight={(
                                                <TouchableOpacity style={{
                                                    flexGrow: 1,

                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }} onPress={() => {
                                                    setWaypoints(waypoints.filter((_, itemIndex) => itemIndex !== index));
                                                }}>
                                                    <FontAwesome5 name={"times"} size={24} color={theme.color}/>
                                                </TouchableOpacity>
                                            )} props={{
                                                editable: false
                                            }}/>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                        </View>
                    </ScrollView>

                    <Button primary={true} label="Open in Google Maps" onPress={() => {
                        Linking.openURL(getGoogleMapsDirectionsUrl(waypoints));
                    }}/>
                </View>
            )}

            {(internetConnection === "OFFLINE")?(
                <OfflinePageOverlay/>
            ):((!userData.user?.subscribed)?(
                <PageOverlay/>
            ):((permissions !== null && !permissions.granted) && (
                <PermissionsPageOverlay required={[ "foreground" ]} onGranted={(permissions) => setPermissions(permissions)}/>
            )))}
        </View>
    );
}
