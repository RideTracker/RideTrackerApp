import React, { useState } from "react";
import { Stack } from "expo-router";
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useTheme } from "../../../../utils/themes";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { CaptionText } from "../../../../components/texts/Caption";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import FormDivider from "../../../../components/FormDivider";
import Button from "../../../../components/Button";
import { usePreventScreenCapture } from 'expo-screen-capture';

export default function ProfileDevices() {
    usePreventScreenCapture();

    const theme = useTheme();

    const [ active, setActive ] = useState<boolean>(false);
    const [ code, setCode ] = useState<string>(null);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Wearable Devices" }}/>

            <View style={{ flexShrink: 1, padding: 10, gap: 10 }}>
                <View style={{ flexShrink: 1, gap: 10, flexDirection: "column" }}>
                    <View>
                        <CaptionText>How does it work?</CaptionText>
                        <ParagraphText>Gain more insights of your rides by installing our app on your wearable device.</ParagraphText>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <CaptionText style={{ fontSize: 36, width: 60, textAlign: "center" }}>1.</CaptionText>
                        <ParagraphText style={{ paddingRight: 80 }}>Install the RideTracker app on your wearable device from the Play Store.</ParagraphText>
                    </View>
                    
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <CaptionText style={{ fontSize: 36, width: 60, textAlign: "center" }}>2.</CaptionText>
                        <ParagraphText style={{ paddingRight: 80 }}>Start the app on your wearable device and choose "login with app".</ParagraphText>
                    </View>

                    <View style={{ gap: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <CaptionText style={{ fontSize: 36, width: 60, textAlign: "center" }}>3.</CaptionText>
                            <ParagraphText style={{ paddingRight: 80 }}>Click on the button below to reveal your 6 digit code and follow the instructions on your wearable device.</ParagraphText>
                        </View>

                        <Button primary={false} type={(code)?("stroke"):(undefined)} label={(!active)?("Reveal my temporary code"):((code)?(code):(undefined))} disabled={active} onPress={() => {
                            setActive(true);
                            setCode("213 546");
                        }}>
                            {(active && !code) && (<ActivityIndicator color={theme.brand}/>)}
                        </Button>

                        <ParagraphText>The provided code refreshes every 30 seconds while visible and expires when dismissed.</ParagraphText>
                    </View>
                </View>

                <FormDivider/>

                <View style={{ flexShrink: 1 }}>
                    <ScrollView>
                        <View style={{
                            flexDirection: "row",
                            gap: 10
                        }}>
                            <View style={{
                                width: 60,
                                height: 60,
                                borderRadius: 60,

                                justifyContent: "center",
                                alignItems: "center",

                                backgroundColor: theme.border
                            }}>
                                <MaterialCommunityIcons name="watch" size={36} color={theme.color}/>
                            </View>

                            <View style={{
                                justifyContent: "space-evenly"
                            }}>
                                <CaptionText>Samsung Galaxy Watch 5</CaptionText>
                                <ParagraphText>Last used a moment ago</ParagraphText>
                            </View>
                            
                            <TouchableOpacity style={{
                                width: 60,
                                height: 60,

                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <FontAwesome5 name="times" size={24} color={theme.red}/>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};
