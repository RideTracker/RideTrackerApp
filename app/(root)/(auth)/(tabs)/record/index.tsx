import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Tabs, useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "../../../../../utils/themes";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; 
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import EventEmitter from "EventEmitter";
import { formatTime } from "../../../../../utils/time";
import { useUser } from "../../../../../modules/user/useUser";
import Recorder from "../../../../../utils/Recorder";
import { ParagraphText } from "../../../../../components/texts/Paragraph";
import MapFinishMarker from "../../../../../components/maps/MapFinishMarker";
import MapStartMarker from "../../../../../components/maps/MapStartMarker";
import MapIntermediateMarker from "../../../../../components/maps/MapIntermediateMarker";
import MapLocationMarker from "../../../../../components/maps/MapLocationMarker";
import * as KeepAwake from "expo-keep-awake";
import { compareUrlSearchParams } from "expo-router/src/LocationProvider";
import * as NavigationBar from "expo-navigation-bar";
import { NavigationBarVisibility } from "expo-navigation-bar";
import { NavigationBarBehavior } from "expo-navigation-bar";
import { BatteryState } from "expo-battery";
import { CaptionText } from "../../../../../components/texts/Caption";
import PermissionsPageOverlay from "../../../../../components/PermissionsPageOverlay";
import { RecordingSessionBatteryState, RecordingSessionCoordinate } from "@ridetracker/ridetrackertypes";

export default function Record() {
    if(Platform.OS === "web")
        return (<Text>Unsupported for web</Text>);

    const theme = useTheme();
    const router = useRouter();
    const mapRef = useRef<MapView>();
    const userData = useUser();

    const [ id ] = useState(uuid.v4());
    const [ recorder ] = useState(new Recorder());
    const [ recording, setRecording ] = useState(null);
    const [ overlayVisible, setOverlayVisible ] = useState(true);
    const [ distance, setDistance ] = useState(0);
    const [ elevation, setElevation ] = useState(0);
    const [ time, setTime ] = useState(0);
    const [ timer, setTimer ] = useState<NodeJS.Timer>(null);
    const [ focus, setFocus ] = useState<boolean>(true);
    const [ notices, setNotices ] = useState<string[]>([]);
    const [ keepAwake, setKeepAwake ] = useState<boolean>(false);
    const [ permissions, setPermissions ] = useState<Location.LocationPermissionResponse>(null);

    useFocusEffect(() => {
        setFocus(true);

        return () => {
            setFocus(false);
        };
    });

    if(Platform.OS === "android") {
        useEffect(() => {
            let originalVisibility: NavigationBarVisibility = null;

            NavigationBar.getVisibilityAsync().then((visibility) => {
                if(visibility !== "hidden") {
                    originalVisibility = visibility;

                    NavigationBar.setVisibilityAsync("hidden");
                }
            });

            return () => {
                if(originalVisibility)
                    NavigationBar.setVisibilityAsync(originalVisibility);
            };
        }, []);
    }

    useEffect(() => {
        return () => {
            if(keepAwake)
                KeepAwake.deactivateKeepAwake("RideTrackerAppKeepAwake");
        };
    }, []);

    useEffect(() => {
        Location.getBackgroundPermissionsAsync().then((permissions) => {
            setPermissions(permissions);
        });
    }, []);

    useEffect(() => {
        if(permissions?.granted) {
            if(mapRef.current) {
                Location.getLastKnownPositionAsync().then((lastLocation) => {
                    if(lastLocation !== null) {
                        mapRef.current.animateCamera({
                            center: {
                                latitude: lastLocation.coords.latitude,
                                longitude: lastLocation.coords.longitude
                            },

                            zoom: 12
                        });
                    }
                });
            }
        }
    }, [ permissions ]);

    useEffect(() => {
        if(recording && !recorder.active) {
            // enable recording
            setNotices(notices.concat("Waiting for location information..."));

            recorder.onLocation = () => {
                setNotices(notices.filter((notice) => notice !== "Waiting for location information..."));

                recorder.onLocation = undefined;
            };

            recorder.start();

            setOverlayVisible(true);

            setTimer(setInterval(() => {
                if(focus) {
                    setTime(recorder.getElapsedTime());

                    if(mapRef.current) {
                        const lastCoordinate = recorder.getLastItem<RecordingSessionCoordinate>("coordinates");

                        if(lastCoordinate) {
                            mapRef.current.animateCamera({
                                center: {
                                    latitude: lastCoordinate.coordinate.latitude,
                                    longitude: lastCoordinate.coordinate.longitude
                                }
                            });
                        }
                    }
                }
            }, 1000));

            if(keepAwake)
                KeepAwake.activateKeepAwakeAsync("RideTrackerAppKeepAwake");
        }
        else if(!recording && recorder.active) {
            // disable recording
            setNotices(notices.filter((notice) => notice !== "Waiting for location information..."));

            recorder.onLocation = undefined;

            recorder.stop();

            if(timer) {
                clearInterval(timer);

                setTimer(null);
            }

            recorder.saveCurrentSession();

            if(keepAwake)
                KeepAwake.deactivateKeepAwake("RideTrackerAppKeepAwake");
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

    useEffect(() => {
        if(notices.length) {
            const timeout = setTimeout(() => {
                setNotices(notices.filter((notice) => notice === "Waiting for location information..."));
            }, 4000);

            return () => {
                clearInterval(timeout);
            };
        }
    }, [ notices ]);

    const handleSubmitPress = useCallback(() => {
        if(recording === null) 
            return router.back();

        router.push(`/recordings/${id}/upload`);
    }, [ recording ]);

    const handleKeepAwakePress = useCallback(() => {
        if(keepAwake) {
            KeepAwake.deactivateKeepAwake("RideTrackerAppKeepAwake");

            setKeepAwake(false);

            setNotices(notices.filter((notice) => notice !== "Warning, using the keep awake function may drain your battery quicker."));
        }
        else {
            KeepAwake.activateKeepAwakeAsync("RideTrackerAppKeepAwake");

            setKeepAwake(true);
            
            setNotices(notices.concat("Warning, using the keep awake function may drain your battery quicker."));
        }
    }, [ keepAwake ]);

    const lastCoordinate = recorder.getLastItem<RecordingSessionCoordinate>("coordinates");
    const lastBatteryState = recorder.getLastItem<RecordingSessionBatteryState>("batteryStates");

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

                headerRight: () => (recording !== true)?(
                    <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={handleSubmitPress}>
                        <Text style={{ color: "#FFF", fontSize: 18, textShadowColor: "rgba(0, 0, 0, .1)", textShadowRadius: 2 }}>
                            {(recording === null)?("Close"):("Finish")}
                        </Text>
                    </TouchableOpacity>
                ):(
                    <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={handleKeepAwakePress}>
                        <Text style={{ color: "#FFF", fontSize: 18, textShadowColor: "rgba(0, 0, 0, .1)", textShadowRadius: 2 }}>
                            <Ionicons name={(keepAwake)?("ios-sunny"):("ios-sunny-outline")} size={24} color={theme.color}/>
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
                    showsUserLocation={false}
                    showsMyLocationButton={false}

                    zoomEnabled={!recording}
                    pitchEnabled={!recording}
                    rotateEnabled={!recording}
                    scrollEnabled={!recording}
                    zoomControlEnabled={false}
                    zoomTapEnabled={!recording}
                >
                    {recorder.recording.sessions.map((session, index) => (
                        <React.Fragment key={session.id}>
                            <Polyline coordinates={session.coordinates.map((location) => location.coordinate)} strokeWidth={3} fillColor={"white"} strokeColor={"white"}/>

                            {(session.coordinates.length > 0) && (
                                (index === 0)?(
                                    <MapStartMarker coordinate={session.coordinates[0].coordinate} style={{
                                        zIndex: (index * 10)  
                                    }}/>
                                ):(
                                    <MapIntermediateMarker coordinate={session.coordinates[0].coordinate} style={{
                                        zIndex: (index * 10)  
                                    }}/>
                                )
                            )}

                            {(session.coordinates.length > 1) && (
                                (index !== recorder.recording.sessions.length - 1)?(
                                    <MapIntermediateMarker coordinate={session.coordinates[session.coordinates.length - 1].coordinate} style={{
                                        zIndex: (index * 10) + 1  
                                    }}/>
                                ):((!recorder.active) && (
                                    <MapFinishMarker coordinate={session.coordinates[session.coordinates.length - 1].coordinate} style={{
                                        zIndex: (index * 10) + 1
                                    }}/>
                                ))
                            )}
                        </React.Fragment>
                    ))}

                    {(lastCoordinate) && (
                        <MapLocationMarker coordinate={lastCoordinate.coordinate} style={{
                            zIndex: recorder.recording.sessions.length * 10  
                        }}/>
                    )}
                </MapView>
            )}

            {(overlayVisible) && (
                <View
                    onTouchStart={() => {
                        if(!recording) {
                            setOverlayVisible(false);
                        }
                        else if(!notices.includes("Screen functions are disabled during recording.")) {
                            setNotices(notices.concat("Screen functions are disabled during recording."));
                        }
                    }}
                    style={{
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
                <LinearGradient colors={[ (recording && !keepAwake)?("rgba(0, 0, 0, .5)"):("transparent"), "transparent" ]} locations={[ 0.5, 1.0 ]} style={{
                    gap: 10,
                    width: "100%",

                    alignItems: "center",

                    paddingHorizontal: 10,

                    paddingTop: 100,
                    paddingBottom: 40,
    
                    flexDirection: "column"
                }}>
                    {(lastBatteryState) && (lastBatteryState.batteryState.batteryLevel <= 20 && lastBatteryState.batteryState.batteryState !== "CHARGING") && (
                        <View style={{
                            width: "100%",

                            flexDirection: "row",
                            gap: 10,

                            alignContent: "center",
                            justifyContent: "center"
                        }}>
                            <Ionicons name="md-battery-charging-outline" size={40} color={(lastBatteryState.batteryState.batteryLevel <= 10)?(theme.red):(theme.orange)} style={{
                                alignSelf: "center",
                                width: 40
                            }}/>
                        
                            <View style={{ flex: 1, paddingRight: 40 }}>
                                <CaptionText style={{ color: "white" }}>{(lastBatteryState.batteryState.batteryLevel <= 10)?("Critical"):("Low")} battery level</CaptionText>
                                <ParagraphText style={{ color: "white" }}>
                                    {(lastBatteryState.batteryState.lowPowerMode)?("Consider connecting your phone to a powerbank if you have one!"):(`Consider enabling ${(Platform.OS === "android")?("power saver mode"):((Platform.OS === "ios")?("low power mode"):("battery saving mode"))} to save your battery!`)}
                                </ParagraphText>
                            </View>
                        </View>
                    )}

                    {(notices.length > 0) && (
                        <View style={{ width: "100%" }}>
                            {notices.map((notice) => (
                                <ParagraphText key={notice} style={{ textAlign: "center", color: "white", textShadowColor: "black", textShadowRadius: 2 }}>{notice}</ParagraphText>
                            ))}
                        </View>
                    )}
                </LinearGradient>
            </View>

            <View style={{
                position: "absolute",
                bottom: 0,

                width: "100%"
            }}>
                <LinearGradient colors={[ "transparent", (recording && !keepAwake)?("rgba(0, 0, 0, .6)"):("transparent") ]} style={{
                    alignItems: "center",

                    gap: 10,
                    paddingVertical: 40,

                    flexDirection: "column"
                }}>
                    {(recording !== null) && (
                        <View style={{
                            gap: 10,

                            alignItems: "center",
                            flexDirection: "column"
                        }} pointerEvents="none">
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
                        </View>
                    )}

                    <View pointerEvents="auto">
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

            {(permissions && !permissions.granted) && (
                <PermissionsPageOverlay required={[ "foreground", "background" ]} onGranted={(permissions) => setPermissions(permissions)}/>
            )}
        </View>
    );
}
