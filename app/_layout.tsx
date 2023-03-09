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
            
            <Stack.Screen
                name="index"
                options={{
                    presentation: null
                }}
            />
            
            <Stack.Screen
                name="routes"
                options={{
                    presentation: null
                }}
            />
            
            <Stack.Screen
                name="record"
                options={{
                    presentation: null
                }}
            />
            
            <Stack.Screen
                name="profile"
                options={{
                    presentation: null
                }}
            />
            
            <Stack.Screen
                name="settings"
                options={{
                    presentation: null
                }}
            />
        </Stack>
    );
};
