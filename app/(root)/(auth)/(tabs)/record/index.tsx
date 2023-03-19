import { useEffect, useRef, useState } from "react";
import { Alert, Button, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Stack, Tabs, useRouter } from "expo-router";
import { useThemeConfig } from "../../../../../utils/themes";
import MapView, { Circle, Marker, Overlay, PROVIDER_GOOGLE } from "react-native-maps";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import EventEmitter from "EventEmitter";

const RECORD_TASK_NAME = "RECORD_GEOLOCATION";
export const RECORDINGS_PATH = FileSystem.documentDirectory + "/recordings/";

const locationEmitter = new EventEmitter();

TaskManager.defineTask(RECORD_TASK_NAME, ({ data, error }: { data: any, error: any }) => {
    const locations = data.locations;

    if(error || !locations.length) {
        console.error("Geolocation error occurred, ", error);

        return;
    }

    console.log("Geolocation received new locations", locations);

    locationEmitter.emit("LOCATION_UPDATE", locations);
});

export default function Record() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();
    const mapRef = useRef();

    const [ id ] = useState(uuid.v4());
    const [ location, setLocation ] = useState(null);
    const [ recording, setRecording ] = useState(null);
    const [ session, setSession ] = useState(null);
    const [ elevation, setElevation ] = useState(0);

    async function ensureDirectoryExists() {
        const info = await FileSystem.getInfoAsync(RECORDINGS_PATH);

        if(!info.exists)
            await FileSystem.makeDirectoryAsync(RECORDINGS_PATH);
    };

    async function saveSession(session) {
        await ensureDirectoryExists();

        const recordingPath = RECORDINGS_PATH + id + ".json";

        const info = await FileSystem.getInfoAsync(recordingPath);

        if(!info.exists)
            await FileSystem.writeAsStringAsync(recordingPath, JSON.stringify([]));

        const sessions = JSON.parse(await FileSystem.readAsStringAsync(recordingPath)) as any[];

        const existingSessionIndex = sessions.findIndex((x) => x.id === session.id);

        if(existingSessionIndex !== -1)
            sessions[existingSessionIndex] = session;
        else
            sessions.push(session);

        await FileSystem.writeAsStringAsync(recordingPath, JSON.stringify(sessions));
    };

    useEffect(() => {
        if(Platform.OS !== "android")
            return;

        async function getLocationPermissions() {
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

            const lastLocation = await Location.getLastKnownPositionAsync();

            if(lastLocation !== null)
                setLocation(lastLocation);
        };

        getLocationPermissions();
    }, []);

    useEffect(() => {
        locationEmitter.on("LOCATION_UPDATE", (locations) => {
            setLocation(locations[locations.length - 1]);
        });

        return () => {
            locationEmitter.off("LOCATION_UPDATE");
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

    useEffect(() => {
        if(recording && !session) {
            Location.startLocationUpdatesAsync(RECORD_TASK_NAME, {
                accuracy: Location.Accuracy.BestForNavigation,
                activityType: Location.ActivityType.Fitness,

                showsBackgroundLocationIndicator: true,

                foregroundService: {
                    notificationTitle: "Ride Tracker Recording",
                    notificationBody: "Ride Tracker is tracking your position in the background while you're recording an activity.",
                    notificationColor: themeConfig.brand
                }
            });

            setSession({
                id: uuid.v4(),
                locations: []
            });
        }
        else if(!recording && session) {
            Location.stopLocationUpdatesAsync(RECORD_TASK_NAME);

            saveSession(session);
            setSession(null);
        }
    }, [ recording ]);

    useEffect(() => {
        if(recording) {
            const previousLocation = session.locations[session.locations.length - 1];

            if(previousLocation) {
                const altitude = (location.coords.altitude - previousLocation.coords.altitude);

                if(altitude > 0) {
                    setElevation(elevation + (location.coords.altitude - previousLocation.coords.altitude));
                }
            }

            setSession({
                ...session,
                locations: [ ...session.locations, location ]
            });
        }
    }, [ location ]);

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

                        router.push(`/recordings/${id}/upload`);
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

                zoomEnabled={!recording}
                pitchEnabled={!recording}
                rotateEnabled={!recording}
                scrollEnabled={!recording}
                zoomControlEnabled={!recording}
                zoomTapEnabled={!recording}
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
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%"
            }}>
                <LinearGradient colors={[ "rgba(0, 0, 0, .5)", "transparent" ]} locations={[ 0.5, 1.0 ]} style={{
                    gap: 10,
                    width: "100%",

                    alignItems: "center",

                    paddingTop: 100,
                    paddingBottom: 40,
    
                    flexDirection: "column"
                }}>
                    {(recording)?(
                        ((location) && (
                            <View>
                                <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 60, fontWeight: "600" }}>{Math.round((location.coords.speed * 3.6) * 10) / 10} km/h</Text>
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
                </LinearGradient>
            </View>

            <View style={{
                position: "absolute",
                bottom: 0,

                width: "100%"
            }}>
                <LinearGradient colors={[ "transparent", "rgba(0, 0, 0, .5)" ]} style={{
                    alignItems: "center",

                    gap: 10,
                    paddingVertical: 40,

                    flexDirection: "column"
                    }}>
                    <View>
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
                                <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 34, fontWeight: "600" }}>{Math.round(elevation)} m</Text>
                                <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 30 }}>elevation</Text>
                            </View>

                            <View style={{ width: "50%" }}>
                                <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 34, fontWeight: "600" }}>? km</Text>
                                <Text style={{ textAlign: "center", color: (recording && themeConfig.contrast === "black")?("#171A23"):("#FFF"), fontSize: 30 }}>distance</Text>
                            </View>
                        </View>
                    )}
                </LinearGradient>
            </View>
        </View>
    );
};
