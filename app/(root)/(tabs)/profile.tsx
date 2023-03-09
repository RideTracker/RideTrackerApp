import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";

export default function Profile() {
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFF" }}>
            <Stack.Screen options={{ title: "Profile" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView></ScrollView>
            </View>
        </View>
    );
};
