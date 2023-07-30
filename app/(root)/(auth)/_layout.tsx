import { Stack } from "expo-router";
import { useTheme } from "../../../utils/themes";

export default function Layout() {
    const theme = useTheme();

    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: theme.background
            },

            headerTintColor: theme.color,

            headerTitleStyle: {
                fontSize: 24,
                fontWeight: "500",
                color: theme.color
            }
        }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="profile/[userId]" options={{ presentation: "card" }} />
            <Stack.Screen name="filter/[filterType]" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="recordings/(index)/dropdown" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="activities/[id]/(index)/dropdown" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="activities/[id]/(index)/userDropdown" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="activities/[id]/edit" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="activities/[id]/comments/list" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="activities/[id]/comments/reply" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="bike/create" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="subscriptions/list" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="polls/[pollId]/answer" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="polls/[pollId]/hide" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            <Stack.Screen name="profile/settings" options={{ presentation: "transparentModal", animation: "fade", headerShown: false }} />
            {/*<Stack.Screen name="ping" options={{ presentation: "modal" }} />*/}
        </Stack>
    );
}
