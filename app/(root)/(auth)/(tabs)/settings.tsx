import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { useThemeConfig } from "../../../../utils/themes";

export default function Settings() {
    const themeConfig = useThemeConfig();
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Settings" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView></ScrollView>
            </View>
        </View>
    );
};
