import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";

import Page from "./app/Layouts/Page.component";

import API from "./app/API";
import Files from "./app/Data/Files";
import Config from "./app/Data/Config";
import Appearance from "./app/Data/Appearance";

SplashScreen.preventAutoHideAsync();

let ready = false;

export default function App() {
    const [ theme, setTheme ] = useState(false);
    const [ appIsReady, setAppIsReady ] = useState(false);

    //await API.ping(true);

    useEffect(() => {
        async function prepare() {
            try { await Location.requestForegroundPermissionsAsync(); } catch {}
            try { await Location.requestBackgroundPermissionsAsync(); } catch {}

            await Config.readAsync();
            Appearance.readConfig();
    
            await SplashScreen.hideAsync();
    
            setAppIsReady(true);
        };

        prepare();
    }, []);

    const onLayout = useCallback(async () => {
      if(appIsReady)
        await SplashScreen.hideAsync();
    }, [ appIsReady ]);

    if(!appIsReady)
        return null;

    const styles = StyleSheet.create({
        document: {
            minHeight: "100%"
        }
    });

    Appearance.addEventListener("change", (theme) => {
        setTheme(theme);
    });

	return (
        <View style={styles.document} onLayout={onLayout}>
            <Page/>
        </View>
	);
}
