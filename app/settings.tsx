import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import Footer from "../components/footer";

export default function Settings() {
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFF" }}>
            <Stack.Screen options={{ title: "Settings" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView></ScrollView>

                <Footer active="/settings"/>
            </View>
        </View>
    );
};
