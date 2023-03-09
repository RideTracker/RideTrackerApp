import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter, Stack } from "expo-router";
import { PingResponse, ping } from "../../models/ping";

export default function Ping() {
    const router = useRouter();

    const [ response, setResponse ] = useState(null);

    useEffect(() => {
        ping(true).then((result) => {
            setResponse((result.error)?(result.error):(result.ping));
        });
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Stack.Screen options={{ title: "Ping" }} />

            <Text>
                {(response)?(`API says: ${response}`):("Pinging the API...")}
            </Text>

            <Text onPress={() => router.back()}>Go back</Text>
        </View>
    );
};
