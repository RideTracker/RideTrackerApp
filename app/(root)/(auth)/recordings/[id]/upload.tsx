import { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform } from "react-native";
import { useRouter, Stack, useSearchParams, useNavigation } from "expo-router";
import { useTheme } from "../../../../../utils/themes";
import FormInput from "../../../../../components/FormInput";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import Button from "../../../../../components/Button";
import Bike from "../../../../../components/Bike";
import * as FileSystem from "expo-file-system";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { CaptionText } from "../../../../../components/texts/Caption";
import { ParagraphText } from "../../../../../components/texts/Paragraph";
import Constants from "expo-constants";
import { useClient } from "../../../../../modules/useClient";
import { createActivity, getBikes, updateActivity } from "@ridetracker/ridetrackerclient";
import { useUser } from "../../../../../modules/user/useUser";
import PageOverlay from "../../../../../components/PageOverlay";
import { SmallText } from "../../../../../components/texts/Small";
import { getDistance } from "geolib";
import { SelectList } from "../../../../../components/SelectList";
import SelectListOverlay from "../../../../../components/SelectListOverlay";
import ActivityEdit, { ActivityEditProperties } from "../../../../../components/ActivityEdit";
import { SafeAreaView } from "react-native-safe-area-context";
import { RECORDINGS_PATH } from "../../../../../utils/Recorder";
import { Recording, RecordingSession, RecordingV1 } from "@ridetracker/ridetrackertypes";
import { Coordinate } from "../../../../../models/Coordinate";

export default function UploadRecordingPage() {
    if(Platform.OS === "web")
        return (<Text>Unsupported for web</Text>);
        
    const client = useClient();
    const theme = useTheme();
    const mapRef = useRef<MapView>();
    const router = useRouter();
    const userData = useUser();

    const { fromRecord } = useSearchParams();

    const [ properties, setProperties ] = useState<ActivityEditProperties>({
        visibility: "PUBLIC"
    });

    const [ polylines, setPolylines ] = useState<Coordinate[][]>([]);
    const [ recording, setRecording ] = useState<Recording | RecordingV1>(null);
    const [ recordings, setRecordings ] = useState<(Recording | RecordingV1)[]>(null);
    const [ uploading, setUploading ] = useState<boolean>(false);
    const [ stats, setStats ] = useState<{
        distance: number;
        maxSpeed: number;
        averageSpeed: number;
    }>(null);

    const { id } = useSearchParams();

    useEffect(() => {
        if(Platform.OS !== "android")
            return;
            
        if(id) {
            async function getRecording() {
                const file = RECORDINGS_PATH + id + ".json";

                const recording = JSON.parse(await FileSystem.readAsStringAsync(file));

                setRecording(recording);
            }

            getRecording();
        }
    }, []);

    useEffect(() => {
        if(recording) {
            try {
                switch((recording as Recording).version) {
                    // V2 (latest as of RideTrackerApp-0.9.3)
                    case 2: {
                        const sessions = (recording as Recording).sessions;

                        let distance = 0;
                        let maxSpeed = 0;
                        const speeds = [];
                        const newPolylines: Coordinate[][] = [];

                        sessions.forEach((session) => {
                            newPolylines.push(session.coordinates.map((coordinates) => coordinates.coordinate));

                            for(let index = 1; index < session.coordinates.length; index++)
                                distance += getDistance(session.coordinates[index - 1].coordinate, session.coordinates[index].coordinate);

                            for(let index = 0; index < session.speeds.length; index++) {
                                speeds.push(session.speeds[index].speed);
            
                                if(session.speeds[index].speed > maxSpeed)
                                    maxSpeed = session.speeds[index].speed;
                            }
                        });

                        setPolylines(newPolylines);

                        const speedSum = speeds.reduce((a, b) => a + b, 0);
                        const averageSpeed = (speedSum / speeds.length) || 0;
            
                        setStats({
                            distance,
                            averageSpeed,
                            maxSpeed
                        });

                        break;
                    }

                    // V1 (deprecated in RideTrackerApp-0.9.3)
                    default: {
                        let distance = 0;
                        let maxSpeed = 0;
                        const speeds = [];
                        const newPolylines: Coordinate[][] = [];

                        const sessions = recording as RecordingV1;

                        sessions.forEach((session) => {
                            newPolylines.push(session.locations.map((location) => {
                                return {
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude
                                };
                            }));

                            for(let index = 1; index < session.locations.length; index++) {
                                distance += getDistance(session.locations[index - 1].coords, session.locations[index].coords);
                                
                                speeds.push(session.locations[index].coords.speed);
            
                                if(session.locations[index].coords.speed > maxSpeed)
                                    maxSpeed = session.locations[index].coords.speed;
                            }
                        });

                        setPolylines(newPolylines);

                        const speedSum = speeds.reduce((a, b) => a + b, 0);
                        const averageSpeed = (speedSum / speeds.length) || 0;
            
                        setStats({
                            distance,
                            averageSpeed,
                            maxSpeed
                        });

                        break;
                    }
                }
            }
            catch(error) {
                console.error(error);
            }

            console.log(recording);
        }
    }, [ recording ]);

    useEffect(() => {
        console.log(polylines);

        if(mapRef.current)
            mapRef.current.fitToCoordinates(polylines.flatMap((polyline) => polyline));
    }, [ polylines, mapRef.current ]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Finish your activity"
            }} />

            <ScrollView>
                <SafeAreaView edges={[ "bottom" ]} style={{
                    gap: 10,
                    padding: 10
                }}>
                    <View style={{ width: "100%", height: 200, borderRadius: 6, overflow: "hidden", backgroundColor: theme.placeholder }}>
                        {(recording) && (
                            <MapView ref={mapRef} provider={userData.mapProvider} maxZoomLevel={14} style={{ width: "100%", height: "100%" }} customMapStyle={theme.mapStyle} onLayout={() => {
                                (mapRef.current as MapView).fitToCoordinates(polylines.flatMap((polyline) => polyline));
                            }}>
                                <Polyline coordinates={polylines.flatMap((polyline) => polyline)} strokeWidth={3} strokeColor={theme.brand}/>
                            </MapView>
                        )}
                    </View>

                    <CaptionText style={{ fontSize: 40, textAlign: "center" }}>Great job, {userData.user?.name.split(' ')[0]}!</CaptionText>

                    <ParagraphText placeholder={!stats}>You reached {Math.round((stats?.distance / 1000) * 10) / 10} km at an average of {Math.round((stats?.averageSpeed * 3.6) * 10) / 10} km/h, at which you topped off at {Math.round((stats?.maxSpeed * 3.6) * 10) / 10} km/h! *</ParagraphText>

                    <ActivityEdit properties={properties} onChange={(partialProperties) => {
                        setProperties({
                            ...properties,
                            ...partialProperties
                        });
                    }}/>

                    <View style={{ marginTop: 20, gap: 10 }}>
                        <SmallText>* preliminary data has not been proccesed yet</SmallText>
                        
                        <Button primary={true} label="Publish activity" onPress={() => {
                            setUploading(true);
                            
                            createActivity(client, recording, properties.visibility).then((result) => {
                                if(result.success) {
                                    updateActivity(client, result.activity.id, properties.visibility, (properties.title?.length)?(properties.title):(null), (properties.description?.length)?(properties.description):(null), properties.bike?.id ?? null).then((result) => {
                                        router.push("/feed");
                                    }).catch(() => {
                                        router.push("/feed");
                                    });
                                }
                                else if(result.message === "You have already uploaded this activity!") {
                                    Alert.alert("Something went wrong", "You have already uploaded this activity!\n\nDo you want to discard it?", [
                                        {
                                            text: "Yes",
                                            onPress: async () => {
                                                const file = RECORDINGS_PATH + id + ".json";
        
                                                const info = await FileSystem.getInfoAsync(file);
        
                                                if(info.exists)
                                                    await FileSystem.deleteAsync(file);
                                                
                                                router.push("/feed");
                                            }
                                        },
                                        { text: "Cancel" }
                                    ]);
                                }
                            });
                        }}/>

                        <Button primary={false} label="Save as draft" onPress={() => router.push("/feed")}/>

                        <Button primary={false} type="danger" label="Discard" onPress={() => {
                            Alert.alert("Discard recording", "Are you sure you want to discard your recording?", [
                                {
                                    text: "I am sure",
                                    onPress: async () => {
                                        const file = RECORDINGS_PATH + id + ".json";

                                        const info = await FileSystem.getInfoAsync(file);

                                        if(info.exists)
                                            await FileSystem.deleteAsync(file);
                                        
                                        router.push("/feed");
                                    }
                                },
                                { text: "Cancel" }
                            ]);
                        }}/>
                    </View>
                </SafeAreaView>
            </ScrollView>

            {(uploading) && (<PageOverlay/>)}
        </View>
    );
}
