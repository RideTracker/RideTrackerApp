import { useState, useEffect, useRef, useCallback } from "react";
import { Alert, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { HeaderText } from "../../../../components/texts/Header";
import * as Location from "expo-location";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
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
    const [ searchPlace, setSearchPlace ] = useState<{
        address: string;
        location: {
            latitude: number;
            longitude: number;
        }
    } | null>(null);

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

    useEffect(() => {
        if(searchPlace) {
            mapRef.current.setCamera({
                center: searchPlace.location,
                zoom: 13
            });
        }
    }, [ searchPlace ]);

    const handleSearchPlace = useCallback((placeId: string) => {
        getMapsGeocode(client, placeId).then((result) => {
            console.log(result);

            if(!result.success)
                return;

            searchRef.current.blur();

            if(!result.places.length) {
                setSearchPlace(null);

                return;
            }

            setSearchPlace(result.places[0]);
        });
    }, [ client, searchRef ]);
    
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
                {(searchPlace) && (
                    <Marker coordinate={searchPlace.location}/>
                )}
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

            <View style={{
                backgroundColor: theme.background,

                width: "100%",
                height: 50,

                position: "absolute",

                bottom: 0,
                left: 0,

                padding: 10,

                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
            }}>
                <HeaderText>Segments</HeaderText>
            </View>
        </View>
    );
}
