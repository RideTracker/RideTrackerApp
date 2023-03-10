import { useEffect } from "react";

import { Stack, Tabs } from "expo-router";
import { useThemeConfig } from "../../../utils/themes";

export default function Layout() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: themeConfig.background
            },

            headerTitleStyle: {
                fontSize: 24,
                fontWeight: "500",
                color: themeConfig.color
            }
        }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/*<Stack.Screen name="ping" options={{ presentation: "modal" }} />*/}
        </Stack>
    );
};
