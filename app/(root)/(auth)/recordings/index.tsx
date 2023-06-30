import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import * as FileSystem from "expo-file-system";
import { RECORDINGS_PATH } from "../(tabs)/record";
import { timeSince } from "../../../../utils/time";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { useUser } from "../../../../modules/user/useUser";
import { RecordingSession } from "../../../../models/RecordingSession";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import { LinkText } from "../../../../components/texts/Link";

type RecordingSessionMetadata = {
    id: string;
    sessions: RecordingSession[];
    timestamp: number;
};

type RecordingSummaryProp = {
    recording: RecordingSessionMetadata;
};

function RecordingSummary({ recording }: RecordingSummaryProp) {
    if(Platform.OS === "web")
        return (<Text>Unsupported for web</Text>);

    const theme = useTheme();
    const router = useRouter();
    const mapRef = useRef<MapView>();
    const userData = useUser();

    useEffect(() => {
        if(mapRef.current) {
            mapRef.current.fitToCoordinates(recording.sessions.flatMap((session) => session.locations.map((location) => location.coords)));
        }
    }, [ ]);

    return (
        <TouchableOpacity style={{ height: 80, flexDirection: "row", gap: 10 }} onPress={() => router.push(`/recordings/${recording.id}/upload`)}>
            <View style={{ width: 140, height: "100%", borderRadius: 6, overflow: "hidden" }}>
                <MapView ref={mapRef} provider={userData.mapProvider} maxZoomLevel={14} style={{ width: "100%", height: "100%" }} customMapStyle={theme.mapStyle} onLayout={() => {
                    mapRef.current.fitToCoordinates(recording.sessions.flatMap((session) => session.locations.map((location) => location.coords)));
                }}>
                    {recording.sessions.filter((session) => session).map((session) => (
                        <Polyline key={session.id} coordinates={session.locations.map((location) => location.coords)} strokeWidth={4} fillColor={theme.brand} strokeColor={theme.brand}/>
                    ))}
                </MapView>
            </View>
            
            <Text style={{ fontSize: 16, color: theme.color }}>{(recording.timestamp)?(timeSince(recording.timestamp)):("Unknown")}</Text>
        </TouchableOpacity>
    );
}

export default function RecordingsPage() {
    const theme = useTheme();
    const router = useRouter();

    const [ recordings, setRecordings ] = useState<RecordingSessionMetadata[]>(null);
    const [ corruptedRecordings, setCorruptedRecordings ] = useState<string[]>([]);

    useEffect(() => {
        if(Platform.OS === "web")
            return;
            
        async function getRecordings() {
            const info = await FileSystem.getInfoAsync(RECORDINGS_PATH);

            if(!info.exists)
                return;

            const files = await FileSystem.readDirectoryAsync(RECORDINGS_PATH);

            const recordings: RecordingSessionMetadata[] = [];
            const corruptedRecordings: string[] = [];

            await Promise.all(files.map(async (file) => {
                const id = file.replace(".json", "");
                const sessions: RecordingSession[] = JSON.parse(await FileSystem.readAsStringAsync(RECORDINGS_PATH + file));

                if(sessions.filter((session) => session).length === 0) {
                    corruptedRecordings.push(id);
                
                    return;
                }

                const locations = sessions.filter((session) => session).flatMap((session) => session.locations);

                if(locations.length === 0) {
                    corruptedRecordings.push(id);
                
                    return;
                }

                recordings.push({
                    id,
                    sessions,
                    timestamp: locations[locations.length - 1].timestamp
                });
            }));

            setRecordings(recordings.sort((a, b) => b.timestamp - a.timestamp));
            setCorruptedRecordings(corruptedRecordings);
        }

        getRecordings();
    }, []);
    
    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Recordings",

                headerRight: () => (
                    <TouchableOpacity onPress={() => router.push("/recordings/(index)/dropdown")}>
                        <Entypo name="dots-three-vertical" size={24} color={theme.color}/>
                    </TouchableOpacity>
                )
            }}/>

            <ScrollView style={{ padding: 10 }}>
                {(recordings) && (
                    <View style={{ gap: 20 }}>
                        {(recordings.map((recording) => (
                            <RecordingSummary key={recording.id} recording={recording}/>
                        )))}
                    </View>
                )}
            </ScrollView>

            {(corruptedRecordings.length > 0) && (
                <TouchableOpacity style={{ padding: 20 }} onPress={() => {
                    Alert.alert("Are you sure?", `Are you sure you want to permanently delete these ${corruptedRecordings.length} corrupted ${(corruptedRecordings.length > 1)?("recordings"):("recording")}?\n\nThis cannot be undone.`, [
                        {
                            text: "I am sure",
                            onPress: async () => {
                                await Promise.allSettled(corruptedRecordings.map((id) => {
                                    return FileSystem.deleteAsync(RECORDINGS_PATH + id + ".json");
                                }));

                                setCorruptedRecordings([]);
                            }
                        },

                        {
                            text: "Cancel"
                        }
                    ])
                }}>
                    <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                        <FontAwesome name="warning" size={24} color={theme.color}/>

                        <View>
                            <ParagraphText style={{ paddingRight: 20 + 24 }}>
                                You have {corruptedRecordings.length} corrupted {(corruptedRecordings.length > 1)?("recordings"):("recording")} that currently cannot be salvaged.
                            </ParagraphText>

                            <LinkText>Click here to delete them permanently.</LinkText>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}
