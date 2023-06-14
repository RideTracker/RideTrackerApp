import { useState, useEffect, useRef, useCallback } from "react";
import { Alert, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { HeaderText } from "../../../../components/texts/Header";
import * as Location from "expo-location";
import { FontAwesome, FontAwesome5, Entypo } from "@expo/vector-icons";
import FormInput from "../../../../components/FormInput";
import { getMapsGeocode, getMapsRoutes, getMapsSearchPredictions } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../modules/useClient";
import { CaptionText } from "../../../../components/texts/Caption";
import { PlaceAutocompletePrediction } from "@ridetracker/ridetrackerclient/dist/models/PlaceAutocompletePrediction";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import { useUser } from "../../../../modules/user/useUser";
import { useDispatch } from "react-redux";
import { useSearchPredictions } from "../../../../modules/usePlacesHistory";
import { addSearchPrediction } from "../../../../utils/stores/searchPredictions";
import { SearchPrediction } from "../../../../models/SearchPrediction";
import { decode } from "@googlemaps/polyline-codec";

export default function Routes() {
    const client = useClient();
    const theme = useTheme();
    const router = useRouter();
    const userData = useUser();
    const searchPredictionsHistory = useSearchPredictions();
    const dispatch = useDispatch();

    const mapRef = useRef<MapView>();
    const searchRef = useRef<TextInput>();

    const [ initialLocation, setInitialLocation ] = useState(null);
    
    const [ searchFocus, setSearchFocus ] = useState<boolean>(false);
    const [ searchText, setSearchText ] = useState<string>("");
    const [ searchTimeout, setSearchTimeout ] = useState<NodeJS.Timeout>(null);
    const [ searchPredictions, setSearchPredictions ] = useState<SearchPrediction[]>([]);

    const [ waypoints, setWaypoints ] = useState<SearchPrediction[]>([]);
    const [ polylines, setPolylines ] = useState<{ latitude: number; longitude: number; }[][]>([]);

    const [ sorting, setSorting ] = useState<boolean>(false);

    useEffect(() => {
        Location.getForegroundPermissionsAsync().then(async (permissions) => {
            if(!permissions.granted) {
                const result = await Location.requestForegroundPermissionsAsync();

                if(!result.granted) {
                    router.back();

                    return;
                }
            }

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
        })
    }, []);

    useEffect(() => {
        if(searchTimeout)
            clearInterval(searchTimeout);

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

                if(newWaypoints.length === 0) {
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

                console.log("shoild add");
                dispatch(addSearchPrediction(searchPrediction));

                setWaypoints(newWaypoints);
                
                setSearchPredictions([]);
                searchRef.current.clear();
            });
        }
        else if(searchPrediction.location) {
            searchRef.current.blur();

            let newWaypoints = waypoints;

            if(newWaypoints.length === 0) {
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
    }, [ client, searchRef ]);

    useEffect(() => {
        if(waypoints.length) {
            mapRef.current.fitToElements({
                animated: true,
                edgePadding: {
                    left: 100,
                    top: 200,
                    right: 100,
                    bottom: 200
                }
            });

            getMapsRoutes(client, waypoints.map((waypoint) => waypoint.location)).then((result) => {
                setPolylines(result.polylines.map((polyline) => decode(polyline, 5).map((coordinate) => {
                    return {
                        latitude: coordinate[0],
                        longitude: coordinate[1]
                    };
                })));
            })
        }
    }, [ waypoints.length ]);
    
    return (
        <View style={{ flex: 1, position: "relative", backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Routes",
                headerTransparent: true,
                headerRight: () => (
                    <View style={{ marginRight: 20 }}>
                        <TouchableOpacity>
                            <FontAwesome name="plus" size={24} color={theme.color}/>
                        </TouchableOpacity>
                    </View>
                )
            }} />

            <MapView
                ref={mapRef}
                provider={userData.mapProvider}
                showsUserLocation={true}
                style={{
                    position: "absolute",

                    width: "100%",
                    height: "100%",

                    left: 0,
                    bottom: 0
                }}
                onPanDrag={() => {}}
                customMapStyle={theme.mapStyle}
                >
                {polylines.map((polyline, index) => (
                    <Polyline key={index} coordinates={polyline} fillColor={theme.color} strokeWidth={4}/>                    
                ))}

                {waypoints.map((waypoint, index) => (
                    <Marker key={index} coordinate={waypoint.location} pinColor="blue"/>
                ))}
            </MapView>

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
                                            <FontAwesome5 name={(prediction.location)?("history"):("map-marker-alt")} size={(prediction.location)?(22):(24)} color={theme.color}/>
                                        </View>

                                        <View style={{ justifyContent: "space-evenly" }}>
                                            <CaptionText>{prediction.name}</CaptionText>

                                            {(prediction.description) && (
                                                <ParagraphText>{prediction.description}</ParagraphText>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {(!initialLocation) && (
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
                    <HeaderText>Getting your location...</HeaderText>
                </View>
            )}

            {(!!waypoints.length) && (
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
                }}>
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
                </View>
            )}
        </View>
    );
}
