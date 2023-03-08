import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack screenOptions={{
            headerTitleStyle: {
                fontSize: 18
            }
        }}>
            <Stack.Screen
                name="ping"
                options={{
                    presentation: "modal"
                }}
            />
        </Stack>
    );
};
