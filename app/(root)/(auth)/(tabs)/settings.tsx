import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";

export default function Settings() {
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFF" }}>
            <Stack.Screen options={{ title: "Settings" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView></ScrollView>
            </View>
        </View>
    );
};
