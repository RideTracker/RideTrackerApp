import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { useThemeConfig } from "../../../../utils/themes";

export default function Record() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Record" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView></ScrollView>
            </View>
        </View>
    );
};
