import { useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import { Provider } from "../../utils/auth/provider";
import { Provider as ReduxProvider } from "react-redux";
import store from "../../utils/stores/store";
import { useThemeConfig } from "../../utils/themes";

export default function Layout() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    return (
        <Stack screenOptions={{
            headerShown: false,

            headerStyle: {
                backgroundColor: themeConfig.background
            },

            headerTitleStyle: {
                fontSize: 24,
                fontWeight: "500",
                color: themeConfig.color
            }
        }}>
            <Stack.Screen name="register" options={{
                headerShown: true,
                title: "Register with email address"
            }}/>
        </Stack>
    );
};
