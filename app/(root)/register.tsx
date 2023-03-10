import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter, Stack, Link } from "expo-router";
import { PingResponse, ping } from "../../models/ping";
import { useAuth } from "../../utils/auth/provider";
import { useThemeConfig } from "../../utils/themes";
import Button from "../../components/button";
import { FontAwesome } from '@expo/vector-icons'; 
import FormInput from "../../components/formInput";
import { registerUser } from "../../models/user";
import { useDispatch } from "react-redux";
import { setUserData } from "../../utils/stores/userData";

export default function Register() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

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
            registerUser(firstname, lastname, email, password).then((response) => {
                if(response.error) {
                    Alert.alert("An error occurred!", response.error, [
                        {
                            onPress(value) {
                                setSubmitting(false);
                            }
                        }
                    ]);

                    return;
                }

                dispatch(setUserData({ key: response.key }));

                router.push("/");
            });
        }
    }, [ submitting ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10, backgroundColor: themeConfig.background }}>
            <ScrollView style={{ paddingTop: 10 }}>
                <View style={{ gap: 20, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                    <SafeAreaView style={{ gap: 10 }}>
                        <Text style={{ color: themeConfig.color, fontSize: 20, fontWeight: "500" }}>Fullname</Text>
                        <Text style={{ color: themeConfig.color, fontSize: 16 }}>We aim to be a social platform for real-life involvement and believe best practice is to use real names.</Text>

                        <View style={{
                            flexDirection: "row",
                            gap: 10
                        }}>
                            <FormInput style={{ flexGrow: 1 }} inputRef={firstnameRef} placeholder="Firstname" icon={(<FontAwesome name="user" size={24} color={themeConfig.color}/>)} props={{
                                autoCapitalize: "words",
                                onChangeText: (text) => setFirstname(text),
                                autoComplete: "given-name",
                                autoCorrect: true,
                                enterKeyHint: "next",
                                onSubmitEditing: () => lastnameRef.current.focus()
                            }}/>

                            <FormInput style={{ flexGrow: 1 }} inputRef={lastnameRef} placeholder="Lastname" props={{
                                autoCapitalize: "words",
                                onChangeText: (text) => setLastname(text),
                                autoComplete: "family-name",
                                autoCorrect: true,
                                enterKeyHint: "next",
                                onSubmitEditing: () => emailRef.current.focus()
                            }}/>
                        </View>
                    </SafeAreaView>

                        
                    <SafeAreaView style={{ gap: 10 }}>
                        <Text style={{ color: themeConfig.color, fontSize: 20, fontWeight: "500" }}>Email address</Text>
                        <Text style={{ color: themeConfig.color, fontSize: 16 }}>You will not receive any spam email, we just need to verify your email for spam anti-measures.</Text>

                        <FormInput inputRef={emailRef} placeholder="Email address" icon={(<FontAwesome name="envelope" size={24} color={themeConfig.color}/>)} props={{
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
                        <Text style={{ color: themeConfig.color, fontSize: 20, fontWeight: "500" }}>Password</Text>
                        <Text style={{ color: themeConfig.color, fontSize: 16 }}>Avoid using passwords you use elsewhere, your password must be at least 4 characters long.</Text>

                        <FormInput inputRef={passwordRef} placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={themeConfig.color}/>)} props={{
                            autoCapitalize: "none",
                            onChangeText: (text) => setPassword(text),
                            autoComplete: "current-password",
                            autoCorrect: false,
                            enterKeyHint: "send",
                            secureTextEntry: true,
                            onSubmitEditing: () => setSubmitting(true)
                        }}/>
                    </SafeAreaView>

                    <Button primary={false} label={!submitting && "Register"} onPress={() => setSubmitting(true)}>
                        {(submitting) && (
                            <ActivityIndicator size={24}/>
                        )}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};
