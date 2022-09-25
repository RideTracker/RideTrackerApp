import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";

import Page from "./app/Layouts/Page.component";
import LoginPage from "./app/Layouts/Pages/LoginPage.component";

import API from "./app/API";
import Files from "./app/Data/Files";
import Config from "./app/Data/Config";
import User from "./app/Data/User";
import Appearance from "./app/Data/Appearance";

SplashScreen.preventAutoHideAsync();

let ready = false;

export default function App() {
    const [ showLogin, setShowLogin ] = useState(false);
    const [ appIsReady, setAppIsReady ] = useState(false);

    //await API.ping(true);

    useEffect(() => {
        async function prepare() {
            try { await Location.requestForegroundPermissionsAsync(); } catch {}
            try { await Location.requestBackgroundPermissionsAsync(); } catch {}

            // uncomment to debug login dialog
            await Config.resetAsync();

            await Config.readAsync();
            Appearance.readConfig();

            if(Config.user?.token) {
                User.authenticateAsync().then((success) => {
                    if(!success)
                        setShowLogin(true);
                });
            }
            else if(Config.user.guest == null)
                setShowLogin(true);
    
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
        height: "100%",
        width: "100%"
    });

	return (
        <View style={styles} onLayout={onLayout}>
            <Page/>

            {showLogin == true && (<LoginPage/>)}
        </View>
	);
}
