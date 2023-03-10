import { useEffect, useState } from "react";
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

    const { signIn } = useAuth();

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10, backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Ping" }} />

            <Text style={{
                fontSize: 50,
                fontWeight: "600",
                textAlign: "center",
                marginVertical: 40,
                color: themeConfig.color
            }}>Ride Tracker</Text>

            <SafeAreaView style={{ gap: 10, marginVertical: 10 }}>
                <FormInput placeholder="Email address" icon={(<FontAwesome name="envelope" size={24} color={themeConfig.color}/>)}/>
                <FormInput placeholder="Password" icon={(<FontAwesome name="lock" size={24} color={themeConfig.color}/>)}/>

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

                <Text>OR</Text>

                <View style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: themeConfig.border
                }}/>
            </View>
            
            <View style={{
                marginVertical: 10
            }}>
                <Button primary={false} label="Register with email or phone"/>
            </View>
        </View>
    );
};
