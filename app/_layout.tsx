import { Stack } from "expo-router";
import { Provider } from "../utils/auth/provider";
import { Provider as ReduxProvider } from "react-redux";
import store from "../utils/stores/store";
import { useTheme } from "../utils/themes";

export default function Layout() {
    const theme = useTheme();

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
