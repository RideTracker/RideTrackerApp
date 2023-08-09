import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import * as FileSystem from "expo-file-system";
import { timeSince } from "../../../../utils/time";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { useUser } from "../../../../modules/user/useUser";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import { LinkText } from "../../../../components/texts/Link";
import { Recording, RecordingV1 } from "@ridetracker/ridetrackertypes";
import { Coordinate } from "../../../../models/Coordinate";
import { RECORDINGS_PATH } from "../../../../utils/Recorder";

type RecordingSummary = {
    id: string;
    recording: Recording | RecordingV1;
};

type RecordingSummaryProp = {
    recording: RecordingSummary;
};

function RecordingSummary({ recording }: RecordingSummaryProp) {
    if(Platform.OS === "web")
        return (<Text>Unsupported for web</Text>);

    const theme = useTheme();
    const router = useRouter();
    const mapRef = useRef<MapView>();
    const userData = useUser();

    const [ polylines, setPolylines ] = useState<Coordinate[][]>([]);

    useEffect(() => {
        try {
            switch((recording.recording as Recording).version) {
                // V2 (latest as of RideTrackerApp-0.9.3)
                case 2: {
                    const sessions = (recording.recording as Recording).sessions;

                    setPolylines(sessions.map((session) => session.coordinates.map((coordinates) => coordinates.coordinate)));

                    break;
                }

                // V1 (deprecated in RideTrackerApp-0.9.3)
                default: {
                    console.log(recording);
                    const sessions = recording.recording as RecordingV1;

                    setPolylines(sessions.map((session) => session.locations.map((location) => {
                        return {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        };
                    })));

                    break;
                }
            }
        }
        catch(error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if(polylines) {
            mapRef.current.fitToCoordinates(polylines.flatMap((polyline) => polyline), {
                animated: false
            });
        }
    }, [ polylines ]);

    return (
        <TouchableOpacity style={{ height: 80, flexDirection: "row", gap: 10 }} onPress={() => router.push(`/recordings/${recording.id}/upload`)}>
            <View style={{ width: 140, height: "100%", borderRadius: 6, overflow: "hidden" }}>
                <MapView ref={mapRef} provider={userData.mapProvider} maxZoomLevel={14} style={{ width: "100%", height: "100%" }} customMapStyle={theme.mapStyle} onLayout={() => {
                    mapRef.current.fitToCoordinates(polylines.flatMap((polyline) => polyline), {
                        animated: false
                    });
                }}>
                    {polylines.map((polyline, index) => (
                        <Polyline key={index} coordinates={polyline} strokeWidth={3} fillColor={theme.brand} strokeColor={theme.brand}/>
                    ))}
                </MapView>
            </View>
        </TouchableOpacity>
    );
}

export default function RecordingsPage() {
    const theme = useTheme();
    const router = useRouter();

    const [ recordings, setRecordings ] = useState<RecordingSummary[]>(null);
    const [ corruptedRecordings, setCorruptedRecordings ] = useState<string[]>([]);

    useEffect(() => {
        if(Platform.OS === "web")
            return;
            
        async function getRecordings() {
            const info = await FileSystem.getInfoAsync(RECORDINGS_PATH);

            if(!info.exists)
                return;

            const files = await FileSystem.readDirectoryAsync(RECORDINGS_PATH);

            const recordings: RecordingSummary[] = [];
            const corruptedRecordings: string[] = [];

            await Promise.all(files.map(async (file) => {
                const id = file.replace(".json", "");
                const recording: (Recording | RecordingV1) = JSON.parse(await FileSystem.readAsStringAsync(RECORDINGS_PATH + file));

                recordings.push({
                    id,
                    recording
                });
            }));

            setRecordings(recordings);
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
