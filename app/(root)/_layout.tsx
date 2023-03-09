import { Stack, Tabs } from "expo-router";
import { Provider } from "../../utils/auth/provider";

export default function Layout() {
    return (
        <Provider>
            <Stack screenOptions={{ headerShown: false }}/>
        </Provider>
    );
};
