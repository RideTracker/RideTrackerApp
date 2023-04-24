import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../../../utils/themes";

export default function Routes() {
    const theme = useTheme();
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Routes" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView></ScrollView>
            </View>
        </View>
    );
};
