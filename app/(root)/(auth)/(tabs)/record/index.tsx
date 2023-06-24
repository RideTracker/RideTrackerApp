import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Tabs, useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "../../../../../utils/themes";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import {  FontAwesome5 } from "@expo/vector-icons"; 
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import EventEmitter from "EventEmitter";
import { formatTime } from "../../../../../utils/time";
import { useUser } from "../../../../../modules/user/useUser";
import Recorder from "../../../../../utils/Recorder";

export const RECORDINGS_PATH = FileSystem.documentDirectory + "/recordings/";

export default function Record() {
    if(Platform.OS === "web")
        return (<Text>Unsupported for web</Text>);

    const theme = useTheme();
    const router = useRouter();
    const mapRef = useRef();
    const userData = useUser();

    const [ locationPermissionStatus, requestLocationPermission] = Location.useBackgroundPermissions();

    const [ id ] = useState(uuid.v4());
    const [ location, setLocation ] = useState(null);
    const [ recorder ] = useState(new Recorder());
    const [ recording, setRecording ] = useState(null);
    const [ overlayVisible, setOverlayVisible ] = useState(true);
    const [ distance, setDistance ] = useState(0);
    const [ elevation, setElevation ] = useState(0);
    const [ time, setTime ] = useState(0);
    const [ timer, setTimer ] = useState<NodeJS.Timer>(null);
    const [ focus, setFocus ] = useState<boolean>(true);

    async function ensureDirectoryExists() {
        const info = await FileSystem.getInfoAsync(RECORDINGS_PATH);

        if(!info.exists)
            await FileSystem.makeDirectoryAsync(RECORDINGS_PATH);
    }

    async function saveSession(session) {
        await ensureDirectoryExists();

        const recordingPath = RECORDINGS_PATH + id + ".json";

        const info = await FileSystem.getInfoAsync(recordingPath);

        if(!info.exists)
            await FileSystem.writeAsStringAsync(recordingPath, JSON.stringify([]));

        const sessions = JSON.parse(await FileSystem.readAsStringAsync(recordingPath)) as {
            id: string;
        }[];

        const existingSessionIndex = sessions.findIndex((x) => x.id === session.id);

        if(existingSessionIndex !== -1)
            sessions[existingSessionIndex] = session;
        else
            sessions.push(session);

        await FileSystem.writeAsStringAsync(recordingPath, JSON.stringify(sessions));
    }

    useFocusEffect(() => {
        setFocus(true);

        return () => {
            setFocus(false);
        };
    });

    useEffect(() => {
        if(Platform.OS !== "android")
            return;

        requestLocationPermission().then(async (result) => {
            if(!result.granted) {
                router.push("/record/error");

                return;
            }

            const lastLocation = await Location.getLastKnownPositionAsync();

            if(lastLocation !== null)
                setLocation(lastLocation);
        });
    }, []);

    /*useEffect(() => {
        recorder.onLocation = (location) => {
            setLocation(location);
        };
    }, []);*/

    /*useEffect(() => {
        if(location && mapRef.current && focus) {
            const map: MapView = mapRef.current;

            map.setCamera({
                center: location.coords,
                zoom: 16
            });
        }
    }, [ location, mapRef.current, focus ]);*/

    useEffect(() => {
        if(recording && !recorder.active) {
            recorder.start();

            setOverlayVisible(true);

            setTimer(setInterval(() => {
                if(focus)
                    setTime(recorder.getElapsedTime());
            }, 1000));
        }
        else if(!recording && recorder.active) {
            recorder.stop();

            if(timer) {
                clearInterval(timer);

                setTimer(null);
            }

            const session = recorder.getLastSession();

            if(session)
                saveSession(session);
        }
    }, [ recording ]);

    /*useEffect(() => {
        if(recording) {
            const lastSession = recorder.getLastSession();
            
            const previousLocation = lastSession.locations[lastSession.locations.length - 1];

            if(previousLocation) {
                const altitude = (location.coords.altitude - previousLocation.coords.altitude);
                const timeDifference = location.timestamp - previousLocation.timestamp;

                setDistance(distance + location.coords.speed * (timeDifference / 1000));

                if(altitude > 0) {
                    setElevation(elevation + (location.coords.altitude - previousLocation.coords.altitude));
                }
            }

            const firstTimestamp = recorder.getFirstSession().locations[0].timestamp;
            const lastTimestamp = lastSession.locations[lastSession.locations.length - 1].timestamp;

            //setTime(Math.round((lastTimestamp - firstTimestamp) / 1000));
        }
    }, [ location ]);*/

    const handleSubmitPress = useCallback(() => {
        if(recording === null) 
            return router.back();

        router.push(`/recordings/${id}/upload`);
    }, [ recording ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background }}>
            <Tabs.Screen options={{
                title: (recording)?("Recording"):((recording === null)?("Not recording"):("Paused")),

                headerTitleStyle: {
                    fontSize: 24,
                    fontWeight: "500",
                    color: "white",
                    textShadowColor: "rgba(0, 0, 0, .1)",
                    textShadowRadius: 1
                },

                headerTransparent: true,

                headerRight: () => (recording !== true) && (
                    <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={handleSubmitPress}>
                        <Text style={{ color: "#FFF", fontSize: 18, textShadowColor: "rgba(0, 0, 0, .1)", textShadowRadius: 2 }}>
                            {(recording === null)?("Close"):("Finish")}
                        </Text>
                    </TouchableOpacity>
                )
            }}/>

            {(focus) && (
                <MapView
                    ref={mapRef}
                    
                    style={{
                        flex: 1,
                        position: "absolute",

                        height: "100%",
                        width: "100%"
                    }}
                    
                    customMapStyle={theme.mapStyle.concat(theme.mapStyleFullscreen)}
                    
                    provider={userData.mapProvider}

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
            )}

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
                                <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>TIME</Text>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 60, fontWeight: "600" }}>{formatTime(time)}</Text>
                            </View>
                        
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: "50%" }}>
                                    <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>ELEVATION</Text>
                                    <Text style={{ textAlign: "center", color: "white", fontSize: 34, fontWeight: "600" }}>{Math.round(elevation)} m</Text>
                                </View>

                                <View style={{ width: "50%" }}>
                                    <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>DISTANCE</Text>
                                    <Text style={{ textAlign: "center", color: "white", fontSize: 34, fontWeight: "600" }}>{Math.floor((distance / 1000) * 10) / 10} km</Text>
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

                            backgroundColor: "white"
                        }}>
                            <FontAwesome5 name={(recording)?("stop"):("play")} color={"black"} style={{ marginLeft: (!recording)?(4):(0) }} size={34}/>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
}
