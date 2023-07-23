import { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Alert, Image, Platform } from "react-native";
import { useRouter, Stack, Link, useFocusEffect } from "expo-router";
import { useTheme } from "../../utils/themes";
import Button from "../../components/Button";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const logo = require("../../assets/logos/logo-white.png");
const background = require("../../assets/extras/wallpapers/login.jpg");

export default function IndexPage() {
    const theme = useTheme("light");

    const router = useRouter();

    if(Platform.OS === "android") {
        useFocusEffect(() => {
            let backgroundColor = null;

            NavigationBar.getBackgroundColorAsync().then((value) => {
                backgroundColor = value;
                
                NavigationBar.setBackgroundColorAsync("transparent");
            });
            
            NavigationBar.setPositionAsync("absolute");

            return () => {
                if(backgroundColor)
                    NavigationBar.setBackgroundColorAsync(backgroundColor);

                NavigationBar.setPositionAsync("relative");
            };
        });
    }
    

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Ping" }} />

            <View style={{
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%",

                backgroundColor: theme.color
            }}>
                <Image style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%",

                    opacity: .5
                }} source={background}/>
            </View>

            <SafeAreaView style={{
                flex: 1,

                flexDirection: "column",
                padding: 10
            }} edges={[ "bottom" ]}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Image source={logo} style={{ height: 100, width: "100%", resizeMode: "contain" }}/>
                </View>

                <View style={{ gap: 10 }}>
                    <Button primary={true} label="Create a new account" onPress={() => router.push("/register")}/>
                    <Button primary={false} type="outline" label="I have an existing account" onPress={() => router.push("/login")}/>
                </View>
            </SafeAreaView>
        </View>
    );
}
