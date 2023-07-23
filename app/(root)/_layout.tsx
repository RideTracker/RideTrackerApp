import { Stack } from "expo-router";
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
            },

            contentStyle: {
                backgroundColor: theme.background
            }
        }}>
            <Stack.Screen name="register" options={{
                headerShown: true,
                title: "Register with email address"
            }}/>

            <Stack.Screen name="(public)/update" options={{
                title: "Available update",
                presentation: "modal"
            }}/>
        </Stack>
    );
}
