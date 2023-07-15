import { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import FormInput from "./FormInput";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import SelectListOverlay from "./SelectListOverlay";
import { SelectList } from "./SelectList";
import { GetBikesResponse, getBikes } from "@ridetracker/ridetrackerclient";
import { useClient } from "../modules/useClient";
import { useNavigation, useRouter } from "expo-router";
import { ParagraphText } from "./texts/Paragraph";
import Constants from "expo-constants";
import Bike from "./Bike";
import { SmallText } from "./texts/Small";
import Button from "./Button";

export type ActivityEditProperties = {
    title?: string;
    description?: string;
    visibility: string;
    bike?: GetBikesResponse["bikes"][0];
};

export type ActivityEditProps = {
    properties: ActivityEditProperties;
    onChange: (properties: Partial<ActivityEditProperties>) => void;
};

export default function ActivityEdit({ properties, onChange }: ActivityEditProps) {
    const theme = useTheme();
    const client = useClient();
    const navigation = useNavigation();
    const router = useRouter();

    const [ bikes, setBikes ] = useState(null);
    const [ selectList, setSelectList ] = useState<boolean>(false);
    const [ submitting, setSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        getBikes(client).then((result) => setBikes(result.bikes));

        navigation.addListener("focus", () => {
            getBikes(client).then((result) => setBikes(result.bikes));
        });
    }, []);

    return (
        <View style={{ gap: 10 }}>
            <View>
                <SafeAreaView style={{ gap: 10, marginVertical: 10, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                    <FormInput placeholder="A short summary (optional)" icon={(<FontAwesome name="bicycle" size={24} color={theme.color}/>)} props={{
                        autoCapitalize: "sentences",
                        autoCorrect: true,
                        enterKeyHint: "next",
                        inputMode: "text",
                        //onSubmitEditing: () => passwordRef.current.focus(),
                        onChangeText: (text) => onChange({ title: text }),
                        value: properties.title
                    }}/>
                </SafeAreaView>
                
                <SafeAreaView style={{ gap: 10, marginVertical: 10, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                    <FormInput placeholder="A longer summary (optional)" icon={(<FontAwesome name="comments" size={24} color={theme.color}/>)} props={{
                        autoCapitalize: "sentences",
                        autoCorrect: true,
                        inputMode: "text",
                        multiline: true,
                        //onSubmitEditing: () => passwordRef.current.focus(),
                        onChangeText: (text) => onChange({ description: text }),
                        value: properties.description
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
                    ]} onChange={(value) => onChange({ visibility: value })} initialValue={properties.visibility} onState={(active) => setSelectList(active)} placeholder="Select activity visibility..."/>

                </View>
            </View>

            {(!properties.bike)?(
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
                                    }} onPress={() => onChange({ bike })}>
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

                                    <ParagraphText>Add a bike</ParagraphText>
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
                <Bike id={properties.bike.id} buttons={(
                    <TouchableOpacity onPress={() => onChange({ bike: null })}>
                        <FontAwesome5 name="times" size={24} color={theme.color}/>
                    </TouchableOpacity>
                )}/>
            )}
        </View>
    );
};
