import { useState, useEffect, useRef, useCallback } from "react";
import { Alert, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { HeaderText } from "../../../../components/texts/Header";
import * as Location from "expo-location";
import { FontAwesome, FontAwesome5, Entypo } from "@expo/vector-icons";
import FormInput from "../../../../components/FormInput";
import { getMapsGeocode, getMapsSearchPredictions } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../modules/useClient";
import { CaptionText } from "../../../../components/texts/Caption";
import { PlaceAutocompletePrediction } from "@ridetracker/ridetrackerclient/dist/models/PlaceAutocompletePrediction";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import { useUser } from "../../../../modules/user/useUser";

export default function Routes() {
    const client = useClient();
    const theme = useTheme();
    const router = useRouter();
    const userData = useUser();

    const mapRef = useRef<MapView>();
    const searchRef = useRef<TextInput>();

    const [ initialLocation, setInitialLocation ] = useState(null);
    
    const [ searchFocus, setSearchFocus ] = useState<boolean>(false);
    const [ searchText, setSearchText ] = useState<string>("");
    const [ searchTimeout, setSearchTimeout ] = useState<NodeJS.Timeout>(null);
    const [ searchPredictions, setSearchPredictions ] = useState<PlaceAutocompletePrediction[]>([]);

    const [ waypoints, setWaypoints ] = useState<{
        location: {
            latitude: number;
            longitude: number;
        };

        description?: string;
    }[]>([]);

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
    
                setSearchPredictions(result.predictions);
            });
        }, 500));
    }, [ searchText ]);

    const handleSearchPlace = useCallback((placeId: string) => {
        getMapsGeocode(client, placeId).then((result) => {
            console.log(result);

            if(!result.success)
                return;

            searchRef.current.blur();

            if(!result.places.length)
                return;

            let newWaypoints = waypoints;

            if(newWaypoints.length === 0) {
                newWaypoints = [
                    {
                        location: initialLocation.coords,
                        description: "Your location"
                    }
                ];
            }

            newWaypoints.push({
                location: result.places[0].location,
                description: result.places[0].address
            });

            setWaypoints(newWaypoints);
        });
    }, [ client, searchRef ]);

    useEffect(() => {
        if(waypoints.length) {
            mapRef.current.fitToElements({
                animated: true,
                edgePadding: {
                    left: 10,
                    top: 10,
                    right: 10,
                    bottom: 10
                }
            });
        }
    }, [ waypoints ]);
    
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
                {(!!waypoints.length) && (
                    <Polyline coordinates={waypoints.map((waypoint) => waypoint.location)} fillColor={theme.color} strokeWidth={2}/>                    
                )}

                {waypoints.map((waypoint, index) => (
                    <Marker key={index} coordinate={waypoint.location}/>
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
                            {searchPredictions.map((prediction) => (
                                <TouchableOpacity key={prediction.place_id} onPress={() => {
                                    handleSearchPlace(prediction.place_id);
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
                                            <FontAwesome5 name="map-marker-alt" size={24} color={theme.color}/>
                                        </View>

                                        <View style={{ justifyContent: "space-evenly" }}>
                                            <CaptionText>{prediction.structured_formatting.main_text}</CaptionText>

                                            {(prediction.structured_formatting.secondary_text) && (
                                                <ParagraphText>{prediction.structured_formatting.secondary_text}</ParagraphText>
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
                    <HeaderText>Segments</HeaderText>

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
                                        <FontAwesome5 name={(index === waypoints.length - 1)?("flag-checkered"):("map-marker-alt")} size={24} color={theme.color}/>

                                        {(index !== waypoints.length - 1) && (
                                            <Entypo name="dots-three-vertical" size={20} color={theme.color} style={{ marginBottom: -25, marginTop: 5 }}/>
                                        )}
                                    </View>

                                    <View style={{ flexGrow: 1 }}>
                                        <FormInput value={waypoint.description ?? `Lat: ${waypoint.location.latitude} Lng: ${waypoint.location.longitude}`} iconRight={(
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
