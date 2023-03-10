import { useEffect, useRef } from "react";
import { View, Text, TouchableHighlight, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter, Stack, Link } from "expo-router";
import { PingResponse, ping } from "../../models/ping";
import { useAuth } from "../../utils/auth/provider";
import { useThemeConfig } from "../../utils/themes";
import Button from "../../components/button";
import { FontAwesome } from '@expo/vector-icons'; 
import FormInput from "../../components/formInput";

export default function Login() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();

    const { signIn } = useAuth();

    const email = useRef(null);
    const password = useRef(null);

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10, backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Ping" }} />

            <Text style={{
                fontSize: 50,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 40,
                color: themeConfig.color
            }}>Ride Tracker</Text>

            <SafeAreaView style={{ gap: 10, marginVertical: 10 }}>
                <FormInput inputRef={email} placeholder="Email address" icon={(<FontAwesome name="envelope" size={24} color={themeConfig.color}/>)} props={{
                    autoCapitalize: "none",
                    autoComplete: "email",
                    autoCorrect: false,
                    enterKeyHint: "next",
                    inputMode: "email",
                    keyboardType: "email-address",
                    onSubmitEditing: () => password.current.focus()
                }}/>

                <FormInput inputRef={password} placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={themeConfig.color}/>)} props={{
                    autoCapitalize: "none",
                    autoComplete: "current-password",
                    autoCorrect: false,
                    enterKeyHint: "send",
                    secureTextEntry: true,
                    onSubmitEditing: () => {}
                }}/>

                <Button primary={true} label="Sign in" onPress={() => signIn()}/>

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
                marginVertical: 10
            }}>
                <Button primary={false} label="Register with email address" onPress={() => router.push("/register")}/>
            </View>
        </View>
    );
};
