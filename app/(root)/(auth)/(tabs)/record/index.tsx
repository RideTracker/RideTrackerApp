import { useEffect, useRef, useState } from "react";
import { Alert, Button, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Stack, Tabs, useRouter } from "expo-router";
import { useTheme } from "../../../../../utils/themes";
import MapView, { Circle, Marker, Overlay, PROVIDER_GOOGLE } from "react-native-maps";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import EventEmitter from "EventEmitter";
import { formatTime } from "../../../../../utils/time";
import PagerView from 'react-native-pager-view';

const RECORD_TASK_NAME = "RECORD_GEOLOCATION";
export const RECORDINGS_PATH = FileSystem.documentDirectory + "/recordings/";

const locationEmitter = new EventEmitter();
const timeEmitter = new EventEmitter();

setInterval(() => {
    timeEmitter.emit("INTERVAL");
});

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
    const theme = useTheme();

    const router = useRouter();
    const mapRef = useRef();

    const [ id ] = useState(uuid.v4());
    const [ location, setLocation ] = useState(null);
    const [ recording, setRecording ] = useState(null);
    const [ session, setSession ] = useState(null);
    const [ distance, setDistance ] = useState(0);
    const [ elevation, setElevation ] = useState(0);
    const [ time, setTime ] = useState(0);
    const [ overlayVisible, setOverlayVisible ] = useState(true);

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
        timeEmitter.on("INTERVAL", () => {
            if(recording)
                setTime(time + 1);
        });

        return () => {
            timeEmitter.off("INTERVAL");
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
            if(Platform.OS === "android") {
                Location.startLocationUpdatesAsync(RECORD_TASK_NAME, {
                    accuracy: Location.Accuracy.BestForNavigation,
                    activityType: Location.ActivityType.Fitness,
    
                    showsBackgroundLocationIndicator: true,
    
                    foregroundService: {
                        notificationTitle: "Ride Tracker Recording",
                        notificationBody: "Ride Tracker is tracking your position in the background while you're recording an activity.",
                        notificationColor: theme.brand
                    }
                });
            }

            setOverlayVisible(true);

            setSession({
                id: uuid.v4(),
                locations: []
            });
        }
        else if(!recording && session) {
            if(Platform.OS === "android")
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
                const timeDifference = location.timestamp - previousLocation.timestamp;

                setDistance(distance + location.coords.speed * (timeDifference / 1000));

                if(altitude > 0) {
                    setElevation(elevation + (location.coords.altitude - previousLocation.coords.altitude));
                }
            }

            setSession({
                ...session,
                locations: [ ...session.locations, location ]
            });

            setTime(time + 1);
        }
    }, [ location ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background }}>
            <Tabs.Screen options={{
                title: (recording)?("Recording"):((recording === null)?("Not recording"):("Paused")),

                headerTitleStyle: {
                    fontSize: 24,
                    fontWeight: "500",
                    color: (recording && theme.contrast === "black")?("#171A23"):("#FFF"),
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
                
                customMapStyle={theme.mapStyle.concat(theme.mapStyleFullscreen)}
                
                provider={PROVIDER_GOOGLE}

                showsCompass={false}
                showsUserLocation={true}
                showsMyLocationButton={false}

                zoomEnabled={!recording}
                pitchEnabled={!recording}
                rotateEnabled={!recording}
                scrollEnabled={!recording}
                zoomControlEnabled={false}
                zoomTapEnabled={!recording}
                >
            </MapView>

            {(overlayVisible) && (
                <View onTouchStart={() => !recording && setOverlayVisible(false)} style={{
                    backgroundColor: (recording)?("rgba(0, 0, 0, .25)"):("rgba(0, 0, 0, .7)"),
                    
                    width: "100%",
                    height: "100%",

                    position: "absolute",

                    justifyContent: "center",
                    alignItems: "center"
                }}>
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
            )}

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
                </LinearGradient>
            </View>

            <View style={{
                position: "absolute",
                bottom: 0,

                width: "100%"
            }}>
                <LinearGradient colors={[ "transparent", "rgba(0, 0, 0, .6)" ]} style={{
                    alignItems: "center",

                    gap: 10,
                    paddingVertical: 40,

                    flexDirection: "column"
                    }}>
                    {(recording !== null) && (
                        <>
                            <View style={{ width: "100%" }}>
                                <Text style={{ textAlign: "center", color: (recording && theme.contrast === "black")?("#171A23"):("#FFF"), fontSize: 16 }}>TIME</Text>
                                <Text style={{ textAlign: "center", color: (recording && theme.contrast === "black")?("#171A23"):("#FFF"), fontSize: 60, fontWeight: "600" }}>{formatTime(time)}</Text>
                            </View>
                        
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: "50%" }}>
                                    <Text style={{ textAlign: "center", color: (recording && theme.contrast === "black")?("#171A23"):("#FFF"), fontSize: 16 }}>ELEVATION</Text>
                                    <Text style={{ textAlign: "center", color: (recording && theme.contrast === "black")?("#171A23"):("#FFF"), fontSize: 34, fontWeight: "600" }}>{Math.round(elevation)} m</Text>
                                </View>

                                <View style={{ width: "50%" }}>
                                    <Text style={{ textAlign: "center", color: (recording && theme.contrast === "black")?("#171A23"):("#FFF"), fontSize: 16 }}>DISTANCE</Text>
                                    <Text style={{ textAlign: "center", color: (recording && theme.contrast === "black")?("#171A23"):("#FFF"), fontSize: 34, fontWeight: "600" }}>{Math.floor((distance / 1000) * 10) / 10} km</Text>
                                </View>
                            </View>
                        </>
                    )}

                    <View>
                        <TouchableOpacity onPress={() => setRecording(!recording)} style={{
                            width: 66,
                            borderRadius: 100,
                            aspectRatio: 1,

                            justifyContent: "center",
                            alignItems: "center",

                            backgroundColor: (recording && theme.contrast === "black")?("#171A23"):("#FFF")
                        }}>
                            <FontAwesome5 name={(recording)?("stop"):("play")} color={(recording && theme.contrast === "black")?("#FFF"):("#000")} style={{ marginLeft: (!recording)?(4):(0) }} size={34}/>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
};
