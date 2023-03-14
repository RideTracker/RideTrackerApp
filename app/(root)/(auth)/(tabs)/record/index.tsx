import { useEffect, useRef, useState } from "react";
import { Alert, Button, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Stack, Tabs, useRouter } from "expo-router";
import { useThemeConfig } from "../../../../../utils/themes";
import MapView, { Circle, Marker, Overlay, PROVIDER_GOOGLE } from "react-native-maps";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 

const RECORD_TASK_NAME = "RECORD_GEOLOCATION";

export default function Record() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);
    const router = useRouter();
    const [ location, setLocation ] = useState(null);
    const mapRef = useRef();

    const [ recording, setRecording ] = useState(null);

    useEffect(() => {
        if(Platform.OS !== "android")
            return;

        async function startLocationUpdates() {
            {
                let { status } = await Location.requestForegroundPermissionsAsync();
    
                if(status !== "granted") {
                    router.push("/record/error");
    
                    return;
                }
            }

            {
                let { status } = await Location.requestBackgroundPermissionsAsync();
    
                if(status !== "granted") {
                    router.push("/record/error");
    
                    return;
                }
            }

            TaskManager.defineTask(RECORD_TASK_NAME, ({ data, error }: { data: any, error: any }) => {
                const locations = data.locations;

                if(error || !locations.length) {
                    console.error("Geolocation error occurred, ", error);
            
                    return;
                }
            
                console.log("Geolocation received new locations", locations);

                setLocation(locations[locations.length - 1]);
            });

            if(TaskManager.isTaskDefined(RECORD_TASK_NAME))
                await Location.startLocationUpdatesAsync(RECORD_TASK_NAME);
        };

        startLocationUpdates();

        return () => {
            if(TaskManager.isTaskDefined(RECORD_TASK_NAME))
                TaskManager.unregisterTaskAsync(RECORD_TASK_NAME);

            Location.stopLocationUpdatesAsync(RECORD_TASK_NAME);
        };
    }, []);

    useEffect(() => {
        if(location && mapRef.current) {
            const map: MapView = mapRef.current;

            map.setCamera({
                center: location.coords,
                zoom: 16
            });
        }
    }, [ location, mapRef.current ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: themeConfig.background }}>
            <Tabs.Screen options={{
                title: (recording)?("Recording"):((recording === null)?("Not recording"):("Paused")),

                headerTitleStyle: {
                    fontSize: 24,
                    fontWeight: "500",
                    color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"),
                    textShadowColor: "rgba(0, 0, 0, .1)",
                    textShadowRadius: 1
                },

                headerTransparent: true,

                headerRight: () => (recording !== true) && (
                    <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={() => {
                        if(recording === null) 
                            return router.back();

                        router.push("/record/finish");
                    }}>
                        <Text style={{ color: "#FFF", fontSize: 18, textShadowColor: "rgba(0, 0, 0, .1)", textShadowRadius: 2 }}>
                            {(recording === null)?("Close"):("Finish")}
                        </Text>
                    </TouchableOpacity>
                )
            }}/>

            <MapView
                ref={mapRef}
                
                style={{
                    flex: 1,
                    position: "absolute",

                    height: "100%",
                    width: "100%"
                }}
                
                customMapStyle={themeConfig.mapStyle.concat(themeConfig.mapStyleFullscreen)}
                
                provider={PROVIDER_GOOGLE}

                showsCompass={false}
                showsUserLocation={true}
                showsMyLocationButton={false}
                >
            </MapView>

            <View style={{
                backgroundColor: (recording)?("rgba(0, 0, 0, .25)"):("rgba(0, 0, 0, .7)"),
                
                width: "100%",
                height: "100%",

                position: "absolute",

                justifyContent: "center",
                alignItems: "center"
            }} pointerEvents="none">
                {(recording === null) && (
                    <Text style={{
                        color: "#FFF",
                        textAlign: "center",
                        fontSize: 24
                    }}>
                        Press the play button to start
                    </Text>
                )}
            </View>

            <View style={{
                alignItems: "center",

                position: "absolute",
                top: 60,

                width: "100%",

                gap: 10,
                marginVertical: 40,

                flexDirection: "column"
            }}>
                {(recording)?(
                    ((location) && (
                        <View>
                            <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 60, fontWeight: "600" }}>{location.coords.speed} km/h</Text>
                            <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 46 }}>current speed</Text>
                        </View>
                    ))
                ):((recording !== null) && (
                    <View>
                        <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 60, fontWeight: "600" }}>23.6 km/h</Text>
                        <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 46 }}>average 
                        speed</Text>
                    </View>
                ))}
            </View>

            <View style={{
                alignItems: "center",

                position: "absolute",
                bottom: 0,

                width: "100%",

                gap: 10,
                marginVertical: 40,

                flexDirection: "column"
            }}>
                <View style={{ marginBottom: (recording !== null)?(-20):(0) }}>
                    <TouchableOpacity onPress={() => setRecording(!recording)} style={{
                        width: 66,
                        borderRadius: 100,
                        aspectRatio: 1,

                        justifyContent: "center",
                        alignItems: "center",

                        backgroundColor: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF")
                    }}>
                        <FontAwesome5 name={(recording)?("stop"):("play")} color={(recording && themeConfig.contrast === "black")?("#FFF"):("#000")} style={{ marginLeft: (!recording)?(4):(0) }} size={34}/>
                    </TouchableOpacity>
                </View>

                {(recording !== null) && (
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: "50%" }}>
                            <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 34, fontWeight: "600" }}>23 m</Text>
                            <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 30 }}>elevation</Text>
                        </View>

                        <View style={{ width: "50%" }}>
                            <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 34, fontWeight: "600" }}>12.2 km</Text>
                            <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 30 }}>distance</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};
