import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";

import Navigation from "./app/Components/Navigation.component";
import Page from "./app/Layouts/Page.component";
import LoginPage from "./app/Layouts/Pages/LoginPage.component";

import API from "./app/API";
import Files from "./app/Data/Files";
import Config from "./app/Data/Config";
import User from "./app/Data/User";
import Appearance from "./app/Data/Appearance";

import LandingPage from "./app/Layouts/Pages/LandingPage.component";
import RecordPage from "./app/Layouts/Pages/RecordPage.component";
import SettingsPage from "./app/Layouts/Pages/SettingsPage.component";
import ProfilePage from "./app/Layouts/Pages/ProfilePage.component";

SplashScreen.preventAutoHideAsync();

let ready = false;

export default function App() {
    const [ path, setPath ] = useState("/index");
    const [ appIsReady, setAppIsReady ] = useState(false);

    //await API.ping(true);

    useEffect(() => {
        async function prepare() {
            try { await Location.requestForegroundPermissionsAsync(); } catch {}
            try { await Location.requestBackgroundPermissionsAsync(); } catch {}

            // uncomment to debug login dialog
            // await Config.resetAsync();

            await Config.readAsync();
            Appearance.readConfig();

            if(Config.user?.token) {
                User.authenticateAsync().then((success) => {
                    if(!success)
                        setPath("/login");
                });
            }
            else if(Config.user.guest == null)
                setPath("/login");
    
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

	/*return (
        <View style={styles} onLayout={onLayout}>
            <Page/>

            {showLogin == true && (<LoginPage/>)}
        </View>
	);*/

    return (
        <Navigation path={path} style={{ backgroundColor: Appearance.theme.colorPalette.primary }}>
            <Navigation.Page link="/index">
                <LandingPage onNavigate={(path) => setPath(path)}/>
            </Navigation.Page>
            
            <Navigation.Page link="/record">
                <RecordPage onNavigate={(path) => setPath(path)}/>
            </Navigation.Page>
            
            <Navigation.Page link="/profile">
                <ProfilePage onNavigate={(path) => setPath(path)}/>
            </Navigation.Page>
            
            <Navigation.Page link="/settings">
                <SettingsPage onNavigate={(path) => setPath(path)}/>
            </Navigation.Page>
            
            <Navigation.Page link="/login">
                <LoginPage onNavigate={(path) => setPath(path)}/>
            </Navigation.Page>
        </Navigation>
    );
}
