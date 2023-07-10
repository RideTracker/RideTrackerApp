import { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, ActivityIndicator, Alert, Image } from "react-native";
import { useRouter, Stack, Link } from "expo-router";
import { useTheme } from "../../utils/themes";
import Button from "../../components/Button";
import { FontAwesome } from "@expo/vector-icons"; 
import FormInput from "../../components/FormInput";
import { useDispatch } from "react-redux";
import { setUserData } from "../../utils/stores/userData";
import { useClient } from "../../modules/useClient";
import Client, { authenticateUser, createClient, getRandomToken, loginUser } from "@ridetracker/ridetrackerclient";
import Constants from "expo-constants";
import * as Application from 'expo-application';
import { setClient } from "../../utils/stores/client";
import FormDivider from "../../components/FormDivider";

const logo = require("../../assets/logos/logo.png");

export default function Login() {
    const client = useClient();
    const theme = useTheme();

    const dispatch = useDispatch();

    const router = useRouter();

    const [ submitting, setSubmitting ] = useState(false);

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const passwordRef = useRef(null);

    useEffect(() => {
        if(submitting) {
            loginUser(client, email, password).then((response) => {
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
                    dispatch(setClient(createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                        email,
                        key: response.token.key
                    })));
    
                    dispatch(setUserData({
                        email,
                        token: response.token,
                        user: response.user
                    }));
    
                    router.push("/");
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
            <Stack.Screen options={{ title: "Ping" }} />

            <Image source={logo} style={{ height: 100, width: "100%", resizeMode: "contain" }}/>

            <SafeAreaView style={{ gap: 10, marginVertical: 10, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                <FormInput placeholder="Email address" icon={(<FontAwesome name="envelope" size={24} color={theme.color}/>)} props={{
                    autoCapitalize: "none",
                    autoComplete: "email",
                    autoCorrect: false,
                    enterKeyHint: "next",
                    inputMode: "email",
                    keyboardType: "email-address",
                    onSubmitEditing: () => passwordRef.current.focus(),
                    onChangeText: (text) => setEmail(text)
                }}/>

                <FormInput inputRef={passwordRef} placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={theme.color}/>)} props={{
                    autoCapitalize: "none",
                    autoComplete: "password",
                    autoCorrect: false,
                    enterKeyHint: "send",
                    secureTextEntry: true,
                    onSubmitEditing: () => setSubmitting(true),
                    onChangeText: (text) => setPassword(text)
                }}/>

                <Button primary={true} label={!submitting && "Sign in"} onPress={() => setSubmitting(true)}>
                    {(submitting) && (<ActivityIndicator size={24} color={theme.contrast}/>)}
                </Button>

                <Text style={{
                    textAlign: "center",
                    color: theme.color,
                    marginTop: 10
                }}>Forgot your credentials? <Link href="/forgotten" style={{ color: theme.brand, fontWeight: "500" }}>Click here to recover</Link></Text>
            </SafeAreaView>

            <FormDivider label="or"/>
            
            <View style={{
                marginVertical: 10,
                gap: 10
            }}>
                <Button primary={false} label="Register with email address" onPress={() => router.push("/register")}/>

                {(Constants.expoConfig.extra.environment !== "production") && (
                    <Button primary={false} label="Assume random user" onPress={async () => {
                        const randomUser = await getRandomToken(client);

                        const randomUserClient = createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                            email: randomUser.email,
                            key: randomUser.token.key
                        });

                        const authentication = await authenticateUser(randomUserClient);

                        if(authentication.success) {
                            dispatch(setClient(createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                                email: randomUser.email,
                                key: authentication.token.key
                            })));

                            dispatch(setUserData({
                                email: randomUser.email,
                                token: authentication.token,
                                user: authentication.user
                            }));

                            router.push("/");
                        }
                    }}/>
                )}
            </View>
        </View>
    );
}
