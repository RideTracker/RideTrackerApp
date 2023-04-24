import { useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import { Provider } from "../../utils/auth/provider";
import { Provider as ReduxProvider } from "react-redux";
import store from "../../utils/stores/store";
import { useTheme } from "../../utils/themes";

export default function Layout() {
    const theme = useTheme();

    return (
        <Stack screenOptions={{
            headerShown: false,

            headerStyle: {
                backgroundColor: theme.background
            },

            headerTitleStyle: {
                fontSize: 24,
                fontWeight: "500",
                color: theme.color
            }
        }}>
            <Stack.Screen name="register" options={{
                headerShown: true,
                title: "Register with email address"
            }}/>
        </Stack>
    );
};
