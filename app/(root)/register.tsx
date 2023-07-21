import { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../utils/themes";
import Button from "../../components/Button";
import { FontAwesome } from "@expo/vector-icons"; 
import FormInput from "../../components/FormInput";
import { useClient } from "../../modules/useClient";
import { createRideTrackerClient, registerUser } from "@ridetracker/ridetrackerclient";
import { setClient } from "../../utils/stores/client";
import { setUserData } from "../../utils/stores/userData";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";

export default function Register() {
    const client = useClient();
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();

    const [ submitting, setSubmitting ] = useState(false);

    const [ firstname, setFirstname ] = useState("");
    const [ lastname, setLastname ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const firstnameRef = useRef(null);
    const lastnameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    
    useEffect(() => {
        if(submitting) {
            registerUser(client, firstname, lastname, email, password).then((response) => {
                if(!response.success) {
                    Alert.alert("An error occurred!", response.message, [
                        {
                            onPress() {
                                setSubmitting(false);
                            }
                        }
                    ]);

                    return;
                }

                
                if(response.token) {
                    dispatch(setClient(createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                        identity: email,
                        key: response.token.key,
                        type: "Basic"
                    })));

                    dispatch(setUserData({
                        email,
                        token: response.token,
                        user: response.user
                    }));
    
                    router.push("/avatar-editor/");
                }
                else if(response.verification) {
                    dispatch(setUserData({
                        email
                    }));

                    router.push(`/verify/${response.verification}`);
                }

                //dispatch(setUserData({ key: response.key }));

            });
        }
    }, [ submitting ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10, backgroundColor: theme.background }}>
            <ScrollView style={{ paddingTop: 10 }}>
                <View style={{ gap: 20, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                    <SafeAreaView style={{ gap: 10 }}>
                        <Text style={{ color: theme.color, fontSize: 20, fontWeight: "500" }}>Fullname</Text>
                        <Text style={{ color: theme.color, fontSize: 16 }}>We aim to be a social platform for real-life involvement and believe best practice is to use real names.</Text>

                        <View style={{
                            flexDirection: "row",
                            gap: 10
                        }}>
                            <View style={{ flexGrow: 1 }}>
                                <FormInput inputRef={firstnameRef} placeholder="Firstname" icon={(<FontAwesome name="user" size={24} color={theme.color}/>)} props={{
                                    autoCapitalize: "words",
                                    onChangeText: (text) => setFirstname(text),
                                    autoComplete: "name-given",
                                    autoCorrect: true,
                                    enterKeyHint: "next",
                                    onSubmitEditing: () => lastnameRef.current.focus()
                                }}/>
                            </View>

                            <View style={{ flexGrow: 1 }}>
                                <FormInput inputRef={lastnameRef} placeholder="Lastname" props={{
                                    autoCapitalize: "words",
                                    onChangeText: (text) => setLastname(text),
                                    autoComplete: "name-family",
                                    autoCorrect: true,
                                    enterKeyHint: "next",
                                    onSubmitEditing: () => emailRef.current.focus()
                                }}/>
                            </View>
                        </View>
                    </SafeAreaView>

                        
                    <SafeAreaView style={{ gap: 10 }}>
                        <Text style={{ color: theme.color, fontSize: 20, fontWeight: "500" }}>Email address</Text>
                        <Text style={{ color: theme.color, fontSize: 16 }}>You will not receive any spam email, we just need to verify your email for spam anti-measures.</Text>

                        <FormInput inputRef={emailRef} placeholder="Email address" icon={(<FontAwesome name="envelope" size={24} color={theme.color}/>)} props={{
                            autoCapitalize: "none",
                            onChangeText: (text) => setEmail(text),
                            autoComplete: "email",
                            autoCorrect: false,
                            enterKeyHint: "next",
                            inputMode: "email",
                            keyboardType: "email-address",
                            onSubmitEditing: () => passwordRef.current.focus()
                        }}/>
                    </SafeAreaView>

                    <SafeAreaView style={{ gap: 10 }}>
                        <Text style={{ color: theme.color, fontSize: 20, fontWeight: "500" }}>Password</Text>
                        <Text style={{ color: theme.color, fontSize: 16 }}>Avoid using passwords you use elsewhere, your password must be at least 4 characters long.</Text>

                        <FormInput inputRef={passwordRef} placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={theme.color}/>)} props={{
                            autoCapitalize: "none",
                            onChangeText: (text) => setPassword(text),
                            autoComplete: "password",
                            autoCorrect: false,
                            enterKeyHint: "send",
                            secureTextEntry: true,
                            onSubmitEditing: () => setSubmitting(true)
                        }}/>
                    </SafeAreaView>

                    <Button primary={true} label={!submitting && "Register"} onPress={() => setSubmitting(true)}>
                        {(submitting) && (
                            <ActivityIndicator size={24}/>
                        )}
                    </Button>

                    {(Constants.expoConfig.extra.environment === "dev") && (
                        <Button primary={false} label="Autofill with mock data" onPress={() => {
                            setFirstname("John");
                            setLastname("Mock");
                            setEmail(Math.round(Math.random() * 10000).toString() + "+mock@ridetracker.app");
                            setPassword("123456");

                            setSubmitting(true);
                        }}/>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
