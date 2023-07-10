import React, { useState, useRef } from "react";
import { Alert, Platform, ScrollView, View, TextInput, Linking } from "react-native";
import { useDispatch } from "react-redux";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import Button from "../../../../components/Button";
import { setUserData } from "../../../../utils/stores/userData";
import { setClient } from "../../../../utils/stores/client";
import { SelectList } from "../../../../components/SelectList";
import { useUser } from "../../../../modules/user/useUser";
import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { setSearchPredictions } from "../../../../utils/stores/searchPredictions";
import { createClient, createMessage, deleteUser } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import { CaptionText } from "../../../../components/texts/Caption";
import FormInput from "../../../../components/FormInput";
import { FontAwesome } from "@expo/vector-icons";
import { SmallText } from "../../../../components/texts/Small";
import { useClient } from "../../../../modules/useClient";
import PageOverlay from "../../../../components/PageOverlay";

export default function Settings() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const router = useRouter();
    const userData = useUser();
    const client = useClient();

    const messageRef = useRef<TextInput>();

    const [ selectList, setSelectList ] = useState<string>(null);
    const [ message, setMessage ] = useState<string>("");
    const [ uploading, setUploading ] = useState<boolean>(false);
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Settings" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView style={{ padding: 10 }}>
                    <View style={{ gap: 10 }}>    
                        <ParagraphText>RideTracker is currently in open beta with very limited functions.</ParagraphText>

                        <ParagraphText>All provided functions are expected to work without issues, but unseen bugs may occur.</ParagraphText>
                        
                        <View style={{
                            marginVertical: 10,
                            
                            height: 2,

                            backgroundColor: theme.border
                        }}/>

                        <Button primary={false} label="Dark mode" onPress={() => dispatch(setUserData({ theme: "dark"}))}/>
                        <Button primary={false} label="Light mode" onPress={() => dispatch(setUserData({ theme: "light"}))}/>

                        {(Platform.OS === "ios") && (
                            <SelectList active={selectList === "map"} onState={(active) => setSelectList((active)?("map"):(null))} placeholder="Select map provider..." initialValue={userData.mapProvider} items={[
                                {
                                    key: "default",
                                    text: "Operating system default"
                                },

                                {
                                    key: PROVIDER_GOOGLE,
                                    text: "Google Maps Platform"
                                }
                            ]} onChange={(value) => dispatch(setUserData({ mapProvider: (value !== "default")?(value):(PROVIDER_DEFAULT) }))}/>
                        )}

                        {(Constants.expoConfig.extra.environment !== "production") && (
                            <React.Fragment>
                                <Button primary={false} label="Avatar editor" onPress={() => router.push("/avatar-editor/")}/>

                                <Button primary={false} label="Add subscription" onPress={() => {
                                    dispatch(setUserData({ user: { ...userData.user, subscribed: true } }));
                                }}/>
                                
                                <Button primary={false} label="Reset key" onPress={() => {
                                    dispatch(setUserData({ email: null, token: null }));
                                    dispatch(setClient(createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api)));
                                }}/>

                                <Button primary={false} label="Reset data" onPress={() => {
                                    dispatch(setUserData({ email: undefined, token: undefined, filters: undefined, user: undefined }));
                                    dispatch(setClient(createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api)));
                                }}/>

                                <Button primary={false} label="Reset search predictions" onPress={() => {
                                    dispatch(setSearchPredictions([]));
                                }}/>
                            </React.Fragment>
                        )}

                        {(Platform.OS === "android") && (
                            <React.Fragment>
                                <View style={{
                                    marginVertical: 10,
                                    
                                    height: 2,

                                    backgroundColor: theme.border
                                }}/>

                                <ParagraphText>Manage your subscription on Google Play.</ParagraphText>

                                <Button primary={false} label="Google Play Subscriptions" onPress={() => {
                                    Linking.openURL("https://play.google.com/store/account/subscriptions");
                                }}/>
                            </React.Fragment>
                        )}

                        <View style={{
                            marginVertical: 10,
                            
                            height: 2,

                            backgroundColor: theme.border
                        }}/>
 
                        <ParagraphText>If you come across a bug, or if you have an idea you'd like to propose, we welcome you to submit them here:</ParagraphText>

                        <FormInput inputRef={messageRef} placeholder="Enter your message..." icon={(<FontAwesome name="comments" size={24} color={theme.color}/>)} props={{
                                autoCapitalize: "sentences",
                                autoCorrect: true,
                                inputMode: "text",
                                multiline: true,
                                onChangeText: (text) => setMessage(text)
                            }}
                            style={{
                                textAlignVertical: "top",
                                height: 60
                            }}/>

                        <Button primary={true} label="Submit" onPress={() => {
                            setUploading(true);

                            createMessage(client, message).then((result) => {
                                if(!result.success) {
                                    Alert.alert("Something went wrong!", result.message ?? "Try again later or send an e-mail to contact@ridetracker.app!");

                                    setUploading(false);

                                    return;
                                }

                                Alert.alert("Message has been sent!", "You will receive a reply in your e-mail within a week!");

                                messageRef.current.clear();

                                setUploading(false);
                            });
                        }}/>

                        <View style={{
                            marginVertical: 10,
                            
                            height: 2,

                            backgroundColor: theme.border
                        }}/>

                        <Button primary={false} label="View Privacy Policy" onPress={async () => {
                            if(!(await Linking.canOpenURL("https://ridetracker.app/privacy-policy"))) {
                                Alert.alert("Something went wrong!", "We were not able to open a browser for you. Please visit this link:\n\nhttps://ridetracker.app/privacy-policy");

                                return;
                            }

                            await Linking.openURL("https://ridetracker.app/privacy-policy");
                        }}/>

                        <Button primary={false} type="danger" label="Delete my account" onPress={() => {
                            Alert.alert("Information", "Deleting your account does not delete all of your content. You must do so manually or contact us within 30 days of your account deletion request at privacy@ridetracker.app\n\nAfter the 30 day period, we are no longer able to identify you with your previous content.", [
                                {
                                    text: "Next",
                                    style: "default",
                                    onPress: () => {
                                        Alert.alert("Are you sure?", "Are you sure you want to delete your account? This action is destructive and cannot be undone!\n\nWe reserve the right to process your account deletion up to 30 days.", [
                                            {
                                                text: "I am sure",
                                                style: "destructive",
                                                onPress: () => {
                                                    setUploading(true);

                                                    deleteUser(client).then((result) => {
                                                        if(!result.success) {
                                                            Alert.alert("Something went wrong!", "Something went wrong when deleting your account. Please contact us at privacy@ridetracker.app");

                                                            return;
                                                        }

                                                        Alert.alert("Account deleted", "Your account has now been set up for deletion. We reserve the right to process your account deletion up to 30 days.\n\nYour content will not be deleted. If you wish to have your content deleted, please contact us within 30 days at privacy@ridetracker.app");
                                                        
                                                        dispatch(setUserData({ email: null, token: null }));
                                                        dispatch(setClient(createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api)));
                                                    });

                                                }
                                            },
                                            {
                                                text: "Cancel",
                                                style: "cancel"
                                            }
                                        ]);
                                    }
                                },
                                {
                                    text: "Cancel",
                                    style: "cancel"
                                }
                            ]);
                        }}/>

                        <ParagraphText style={{ color: "grey", textAlign: "center", marginBottom: 20 }}>{Constants.expoConfig.extra.apiUserAgent}</ParagraphText>                    
                    </View>
                </ScrollView>
            </View>

            {(uploading) && (<PageOverlay/>)}
        </View>
    );
}
