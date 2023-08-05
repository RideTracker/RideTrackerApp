import { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform } from "react-native";
import { useRouter, Stack, useSearchParams, useNavigation } from "expo-router";
import { useTheme } from "../../../../../utils/themes";
import FormInput from "../../../../../components/FormInput";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import Button from "../../../../../components/Button";
import Bike from "../../../../../components/Bike";
import * as FileSystem from "expo-file-system";
import { RECORDINGS_PATH } from "../../(tabs)/record";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { CaptionText } from "../../../../../components/texts/Caption";
import { ParagraphText } from "../../../../../components/texts/Paragraph";
import Constants from "expo-constants";
import { useClient } from "../../../../../modules/useClient";
import { createActivity, getBikes, updateActivity } from "@ridetracker/ridetrackerclient";
import { useUser } from "../../../../../modules/user/useUser";
import PageOverlay from "../../../../../components/PageOverlay";
import { SmallText } from "../../../../../components/texts/Small";
import { RecordingSession } from "../../../../../models/RecordingSession";
import { getDistance } from "geolib";
import { SelectList } from "../../../../../components/SelectList";
import SelectListOverlay from "../../../../../components/SelectListOverlay";
import ActivityEdit, { ActivityEditProperties } from "../../../../../components/ActivityEdit";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UploadRecordingPage() {
    if(Platform.OS === "web")
        return (<Text>Unsupported for web</Text>);
        
    const client = useClient();
    const theme = useTheme();
    const mapRef = useRef();
    const router = useRouter();
    const userData = useUser();

    const [ properties, setProperties ] = useState<ActivityEditProperties>({
        visibility: "PUBLIC"
    });

    const [ recording, setRecording ] = useState<{
        id: string,
        locations: RecordingSession["locations"]
    }>(null);
    const [ sessions, setSessions ] = useState<RecordingSession[]>(null);
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

                const sessions = JSON.parse(await FileSystem.readAsStringAsync(file));

                console.log(JSON.stringify(sessions));

                setSessions(sessions);

                setRecording({
                    id: file.substring(0, file.length - ".json".length),
                    locations: sessions[0].locations
                });
            }

            getRecording();
        }
    }, []);

    useEffect(() => {
        if(sessions) {
            let distance = 0;
            let maxSpeed = 0;
            const speeds = [];

            sessions.forEach((session) => {
                for(let index = 1; index < session.locations.length; index++) {
                    distance += getDistance(session.locations[index - 1].coords, session.locations[index].coords);
                    
                    speeds.push(session.locations[index].coords.speed);

                    if(session.locations[index].coords.speed > maxSpeed)
                        maxSpeed = session.locations[index].coords.speed;
                }
            });

            const speedSum = speeds.reduce((a, b) => a + b, 0);
            const averageSpeed = (speedSum / speeds.length) || 0;

            setStats({
                distance,
                averageSpeed,
                maxSpeed
            });
        }
    }, [ sessions ]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Finish your activity" }} />

            <ScrollView>
                <SafeAreaView edges={[ "bottom" ]} style={{
                    gap: 10,
                    padding: 10
                }}>
                    <View style={{ width: "100%", height: 200, borderRadius: 6, overflow: "hidden", backgroundColor: theme.placeholder }}>
                        {(recording) && (
                            <MapView ref={mapRef} provider={userData.mapProvider} maxZoomLevel={14} style={{ width: "100%", height: "100%" }} customMapStyle={theme.mapStyle} onLayout={() => {
                                (mapRef.current as MapView).fitToCoordinates(recording.locations.map((location) => location.coords));
                            }}>
                                <Polyline coordinates={recording.locations.map((location) => location.coords)} strokeWidth={3} strokeColor={theme.brand}/>
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
                            
                            createActivity(client, recording.id, sessions, properties.visibility).then((result) => {
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
                                                const file = RECORDINGS_PATH + recording.id + ".json";
        
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
