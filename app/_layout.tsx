import { Stack } from "expo-router";
import { Provider } from "../utils/auth/provider";
import { Provider as ReduxProvider } from "react-redux";
import store from "../utils/stores/store";

export default function Layout() {
    return (
        <ReduxProvider store={store}>
            <Provider>
                <Stack screenOptions={{
                    headerShown: false,

                    contentStyle: {
                        backgroundColor: "black"
                    }
                }}/>
            </Provider>
        </ReduxProvider>
    );
}
