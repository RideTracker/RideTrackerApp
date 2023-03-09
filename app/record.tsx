import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import Footer from "../components/footer";

export default function Record() {
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFF" }}>
            <Stack.Screen options={{ title: "Record" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView></ScrollView>

                <Footer active="/record"/>
            </View>
        </View>
    );
};
