import { useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import { Provider } from "../utils/auth/provider";
import { Provider as ReduxProvider } from "react-redux";
import store from "../utils/stores/store";
import { useThemeConfig } from "../utils/themes";

export default function Layout() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    return (
        <ReduxProvider store={store}>
            <Provider>
                <Stack screenOptions={{
                    headerShown: false
                }}/>
            </Provider>
        </ReduxProvider>
    );
};
