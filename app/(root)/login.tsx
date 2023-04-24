import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableHighlight, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Image } from "react-native";
import { useRouter, Stack, Link } from "expo-router";
import { PingResponse, ping } from "../../models/ping";
import { useAuth } from "../../utils/auth/provider";
import { useThemeConfig } from "../../utils/themes";
import Button from "../../components/button";
import { FontAwesome } from '@expo/vector-icons'; 
import FormInput from "../../components/formInput";
import { authenticateRandomUser, loginUser } from "../../models/user";
import { useDispatch } from "react-redux";
import { setUserData } from "../../utils/stores/userData";

const logo = require("../../assets/logos/logo.png");

export default function Login() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const dispatch = useDispatch();

    const router = useRouter();

    const [ submitting, setSubmitting ] = useState(false);

    const { signIn } = useAuth();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const passwordRef = useRef(null);

    useEffect(() => {
        if(submitting) {
            loginUser(email, password).then((response) => {
                if(!response.success) {
                    Alert.alert("An error occurred!", response.message, [
                        {
                            onPress(value) {
                                setSubmitting(false);
                            }
                        }
                    ]);

                    return;
                }

                //dispatch(setUserData({ key: response.key }));

                router.push(`/verify/${response.verification}`);
            });
        }
    }, [ submitting ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10, backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Ping" }} />

            <Image source={logo} style={{ height: 100, width: "100%", resizeMode: "contain" }}/>

            <SafeAreaView style={{ gap: 10, marginVertical: 10, opacity: (submitting)?(0.5):(1.0) }} pointerEvents={(submitting)?("none"):("auto")}>
                <FormInput placeholder="Email address" icon={(<FontAwesome name="envelope" size={24} color={themeConfig.color}/>)} props={{
                    autoCapitalize: "none",
                    autoComplete: "email",
                    autoCorrect: false,
                    enterKeyHint: "next",
                    inputMode: "email",
                    keyboardType: "email-address",
                    onSubmitEditing: () => passwordRef.current.focus(),
                    onChangeText: (text) => setEmail(text)
                }}/>

                <FormInput inputRef={passwordRef} placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={themeConfig.color}/>)} props={{
                    autoCapitalize: "none",
                    autoComplete: "current-password",
                    autoCorrect: false,
                    enterKeyHint: "send",
                    secureTextEntry: true,
                    onSubmitEditing: () => setSubmitting(true),
                    onChangeText: (text) => setPassword(text)
                }}/>

                <Button primary={true} label={!submitting && "Sign in"} onPress={() => setSubmitting(true)}>
                    {(submitting) && (<ActivityIndicator size={24} color={themeConfig.contrast}/>)}
                </Button>

                <Text style={{
                    textAlign: "center",
                    color: themeConfig.color,
                    marginTop: 10
                }}>Forgot your credentials? <Link href="/forgotten" style={{ color: themeConfig.brand, fontWeight: "500" }}>Click here to recover</Link></Text>
            </SafeAreaView>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginVertical: 10
            }}>
                <View style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: themeConfig.border
                }}/>

                <Text style={{
                    color: themeConfig.color
                }}>OR</Text>

                <View style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: themeConfig.border
                }}/>
            </View>
            
            <View style={{
                marginVertical: 10,
                gap: 10
            }}>
                <Button primary={false} label="Register with email address" onPress={() => router.push("/register")}/>

                <Button primary={false} label="Assume random user" onPress={async () => {
                    const authentication = await authenticateRandomUser();
                    
                    dispatch(setUserData({
                        key: authentication.key,
                        user: authentication.user
                    }));

                    router.push("/");
                }}/>
            </View>
        </View>
    );
};
