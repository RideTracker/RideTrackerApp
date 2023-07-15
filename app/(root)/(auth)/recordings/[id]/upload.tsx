import { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert, Platform } from "react-native";
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
import { createActivity, getBikes } from "@ridetracker/ridetrackerclient";
import { useUser } from "../../../../../modules/user/useUser";
import PageOverlay from "../../../../../components/PageOverlay";
import { SmallText } from "../../../../../components/texts/Small";
import { RecordingSession } from "../../../../../models/RecordingSession";
import { getDistance } from "geolib";
import { SelectList } from "../../../../../components/SelectList";
import SelectListOverlay from "../../../../../components/SelectListOverlay";

export default function UploadRecordingPage() {
    if(Platform.OS === "web")
        return (<Text>Unsupported for web</Text>);
        
    const client = useClient();
    const theme = useTheme();
    const mapRef = useRef();
    const router = useRouter();
    const userData = useUser();
    const navigation = useNavigation();

    const [ submitting ] = useState(false);

    const [ visibility, setVisibility ] = useState<string>("PUBLIC");
    const [ selectList, setSelectList ] = useState<boolean>(false);

    const [ title, setTitle ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ bikes, setBikes ] = useState(null);
    const [ selectedBike, setSelectedBike ] = useState(null);
    const [ recording, setRecording ] = useState(null);
    const [ sessions, setSessions ] = useState<RecordingSession[]>(null);
    const [ uploading, setUploading ] = useState<boolean>(false);
    const [ stats, setStats ] = useState<{
        distance: number;
        maxSpeed: number;
        averageSpeed: number;
    }>(null);

    const { id } = useSearchParams();

    useEffect(() => {
        getBikes(client).then((result) => setBikes(result.bikes));

        navigation.addListener("focus", () => {
            getBikes(client).then((result) => setBikes(result.bikes));
        });
    }, []);

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

    console.log(bikes);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Finish your activity" }} />

            <ScrollView>
                <View style={{ gap: 10, padding: 10 }}>
                    <View style={{ width: "100%", height: 200, borderRadius: 6, overflow: "hidden", backgroundColor: theme.placeholder }}>
                        {(recording) && (
                            <MapView ref={mapRef} provider={userData.mapProvider} maxZoomLevel={14} style={{ width: "100%", height: "100%" }} customMapStyle={theme.mapStyle} onLayout={() => {
                                (mapRef.current as MapView).fitToCoordinates(recording.locations.map((location) => location.coords));
                            }}>
                                <Polyline coordinates={recording.locations.map((location) => location.coords)} strokeWidth={2} strokeColor={theme.brand}/>
                            </MapView>
                        )}
                    </View>

                    <CaptionText style={{ fontSize: 40, textAlign: "center" }}>Great job, Nora!</CaptionText>

                    <ParagraphText placeholder={!stats}>You reached {Math.round((stats?.distance / 1000) * 10) / 10} km at an average of {Math.round((stats?.averageSpeed * 3.6) * 10) / 10} km/h, at which you topped off at {Math.round((stats?.maxSpeed * 3.6) * 10) / 10} km/h! *</ParagraphText>

                    <View>
                        <SafeAreaView style={{ gap: 10, marginVertical: 10, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                            <FormInput placeholder="A short summary (optional)" icon={(<FontAwesome name="bicycle" size={24} color={theme.color}/>)} props={{
                                autoCapitalize: "sentences",
                                autoCorrect: true,
                                enterKeyHint: "next",
                                inputMode: "text",
                                //onSubmitEditing: () => passwordRef.current.focus(),
                                onChangeText: (text) => setTitle(text)
                            }}/>
                        </SafeAreaView>
                        
                        <SafeAreaView style={{ gap: 10, marginVertical: 10, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                            <FormInput placeholder="A longer summary (optional)" icon={(<FontAwesome name="comments" size={24} color={theme.color}/>)} props={{
                                autoCapitalize: "sentences",
                                autoCorrect: true,
                                inputMode: "text",
                                multiline: true,
                                //onSubmitEditing: () => passwordRef.current.focus(),
                                onChangeText: (text) => setDescription(text)
                            }}
                            style={{
                                textAlignVertical: "top",
                                height: 60
                            }}/>
                        </SafeAreaView>

                        <View style={{ gap: 10 }}>
                            <CaptionText>Who can see this activity?</CaptionText>

                            <SelectListOverlay active={selectList} onCancel={() => setSelectList(false)}/>

                            <SelectList active={selectList} items={[
                                {
                                    key: "PUBLIC",
                                    text: "Everyone"
                                },

                                {
                                    key: "UNLISTED",
                                    text: "Everyone with a link (unlisted)"
                                },

                                {
                                    key: "FOLLOWERS_ONLY",
                                    text: "Only those I follow"
                                },

                                {
                                    key: "PRIVATE",
                                    text: "Only me (private)"
                                }
                            ]} onChange={(value) => setVisibility(value)} initialValue={visibility} onState={(active) => setSelectList(active)} placeholder="Select activity visibility..."/>

                        </View>
                    </View>

                    {(!selectedBike)?(
                        <ScrollView horizontal={true}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                {(bikes)?(
                                    <>
                                        {(bikes.map((bike) => (
                                            <TouchableOpacity key={bike.id} style={{
                                                position: "relative",

                                                height: 80,
                                                width: 140,

                                                backgroundColor: theme.placeholder,
                                                borderRadius: 6,

                                                overflow: "hidden"
                                            }} onPress={() => setSelectedBike((selectedBike?.id === bike.id)?(null):(bike))}>
                                                {(bike.image)?(
                                                    <Image source={{
                                                        uri: `${Constants.expoConfig.extra.images}/${bike.image}/RideTrackerBike`
                                                    }} style={{
                                                        height: 80,
                                                        width: "100%"
                                                    }}/>
                                                ):(
                                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                                        <ParagraphText style={{ textAlign: "center" }}>{bike.name}</ParagraphText>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        )))}

                                        <TouchableOpacity style={{
                                            height: 80,
                                            width: 140,

                                            borderRadius: 6,
                                            borderColor: theme.border,

                                            overflow: "hidden",

                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2
                                        }} onPress={() => router.push("/bike/create")}>
                                            <View style={{ position: "relative" }}>
                                                <FontAwesome name="bicycle" size={32} color={theme.color}/>
                                                <FontAwesome name="plus" size={20} color={theme.color} style={{ 
                                                    position: "absolute",

                                                    right: -10,
                                                    top: -5
                                                }}/>
                                            </View>

                                            <Text style={{ color: theme.color }}>Add a bike</Text>
                                        </TouchableOpacity>
                                    </>
                                ):(
                                    Array(4).fill(null).map((_, index) => (
                                        <View key={index} style={{
                                            position: "relative",

                                            height: 80,
                                            width: 140,

                                            backgroundColor: theme.placeholder,
                                            borderRadius: 6,

                                            overflow: "hidden"
                                        }}/>
                                    ))
                                )}
                            </View>
                        </ScrollView>
                    ):(
                        <Bike id={selectedBike.id} buttons={(
                            <TouchableOpacity onPress={() => setSelectedBike(null)}>
                                <FontAwesome5 name="times" size={24} color={theme.color}/>
                            </TouchableOpacity>
                        )}/>
                    )}

                    <View style={{ marginTop: 20, gap: 10 }}>
                        <SmallText>* preliminary data has not been proccesed yet</SmallText>
                        
                        <Button primary={true} label="Publish activity" onPress={() => {
                            setUploading(true);
                            
                            createActivity(client, sessions, visibility, (title.length)?(title):(null), (description.length)?(title):(null), selectedBike?.id).then((result) => {
                                if(result.success) {
                                    router.push("/index");
                                }
                            });
                        }}/>

                        <Button primary={false} label="Save as draft" onPress={() => router.push("/")}/>

                        <Button primary={false} type="danger" label="Discard" onPress={() => {
                            Alert.alert("Discard recording", "Are you sure you want to discard your recording?", [
                                {
                                    text: "I am sure",
                                    onPress: async () => {
                                        router.push("/index");

                                        const file = RECORDINGS_PATH + id + ".json";

                                        const info = await FileSystem.getInfoAsync(file);

                                        if(info.exists)
                                            await FileSystem.deleteAsync(file);
                                    }
                                },
                                { text: "Cancel" }
                            ]);
                        }}/>
                    </View>
                </View>
            </ScrollView>

            {(uploading) && (<PageOverlay/>)}
        </View>
    );
}
