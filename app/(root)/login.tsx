import { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import { PingResponse, ping } from "../../models/ping";
import { useAuth } from "../../utils/auth/provider";

export default function Login() {
    const { signIn } = useAuth();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Stack.Screen options={{ title: "Ping" }} />

            <TouchableOpacity onPress={() => signIn()}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    );
};
