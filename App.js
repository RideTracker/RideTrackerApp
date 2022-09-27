import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";

import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import Navigation from "app/Components/Navigation.component";
import LoginPage from "app/Components/Layouts/Pages/LoginPage.component";

import Config from "app/Data/Config";
import User from "app/Data/User";
import Appearance from "app/Data/Appearance";

import LandingPage from "app/Components/Layouts/Pages/LandingPage.component";
import RecordPage from "app/Components/Layouts/Pages/RecordPage.component";
import SettingsPage from "app/Components/Layouts/Pages/SettingsPage.component";
import ProfilePage from "app/Components/Layouts/Pages/ProfilePage.component";

SplashScreen.preventAutoHideAsync();

let ready = false;

export default function App() {
    const [ path, setPath ] = useState("/index");
    const [ theme, setTheme ] = useState(null);
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
        
            Appearance.addEventListener("change", (theme) => setTheme(theme));
    
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

    if(Platform.OS == "android") {
        NavigationBar.setBackgroundColorAsync(Appearance.theme.colorPalette.primary);
        NavigationBar.setButtonStyleAsync(Appearance.theme.colorPalette.contrast);
    }
    
    return (
        <>
            <StatusBar style={Appearance.theme.colorPalette.contrast}/>

            <Navigation theme={theme} path={path} style={{ backgroundColor: Appearance.theme.colorPalette.primary }}>
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
        </>
    );
}
