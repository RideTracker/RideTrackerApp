import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { useThemeConfig } from "../../../../utils/themes";
import FormInput from "../../../../components/formInput";
import { FontAwesome, Feather } from '@expo/vector-icons'; 
import Button from "../../../../components/button";
import Bike from "../../../../components/bike";
import { getBikes } from "../../../../models/bike";
import * as FileSystem from "expo-file-system";
import { RECORDINGS_PATH } from "../(tabs)/record";
import { timeSince } from "../../../../utils/time";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";

function RecordingSummary({ recording }) {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();

    const mapRef = useRef();

    useEffect(() => {
        (mapRef.current as MapView).fitToCoordinates(recording.locations.map((location) => location.coords));
    }, []);

    return (
        <TouchableOpacity style={{ height: 80, flexDirection: "row", gap: 10 }} onPress={() => router.push(`/recordings/${recording.id}/upload`)}>
            <View style={{ width: 140, height: "100%", borderRadius: 6, overflow: "hidden" }}>
                <MapView ref={mapRef} provider={PROVIDER_GOOGLE} maxZoomLevel={14} style={{ width: "100%", height: "100%" }} customMapStyle={themeConfig.mapStyle} onLayout={() => {
                    (mapRef.current as MapView).fitToCoordinates(recording.locations.map((location) => location.coords));
                }}>
                    <Polyline coordinates={recording.locations.map((location) => location.coords)} strokeWidth={2} strokeColor={themeConfig.brand}/>
                </MapView>
            </View>
            
            <Text style={{ fontSize: 16, color: themeConfig.color }}>{(recording.timestamp)?(timeSince(recording.timestamp)):("Unknown")}</Text>
        </TouchableOpacity>
    );
};

export default function RecordingsPage() {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();

    const [ recordings, setRecordings ] = useState(null);

    useEffect(() => {
        async function getRecordings() {
            const info = await FileSystem.getInfoAsync(RECORDINGS_PATH);

            if(!info.exists)
                return;

            const files = await FileSystem.readDirectoryAsync(RECORDINGS_PATH);

            if(!files.length)
                return;

            const recordings = await Promise.all(files.map(async (file) => {
                const sessions = JSON.parse(await FileSystem.readAsStringAsync(RECORDINGS_PATH + file));

                const lastSession = sessions[sessions.length - 1];

                return {
                    id: file.substring(0, file.length - ".json".length),
                    locations: sessions.reduce((accumulator, currentValue) => accumulator.concat(currentValue.locations), []),
                    timestamp: (lastSession?.locations?.length)?(lastSession.locations[lastSession.locations.length - 1].timestamp):(0)
                };
            }));

            setRecordings(recordings.sort((a, b) => b.timestamp - a.timestamp));
        };

        getRecordings();
    }, []);
    
    return (
        <View style={{ flex: 1, backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Recordings" }}/>

            <ScrollView style={{ padding: 10 }}>
                {(recordings) && (
                    <View style={{ gap: 20 }}>
                        {(recordings.map((recording) => (
                            <RecordingSummary key={recording.id} recording={recording}/>
                        )))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};
