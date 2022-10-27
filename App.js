import { Component, useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";

import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import LoginPage from "app/Components/Layouts/Pages/LoginPage.component";

import Config from "app/Data/Config";
import User from "app/Data/User";
import Appearance from "app/Data/Appearance";

import LandingPage from "app/Components/Layouts/Pages/LandingPage.component";
import RecordPage from "app/Components/Layouts/Pages/RecordPage.component";
import SettingsPage from "app/Components/Layouts/Pages/SettingsPage.component";
import ProfilePage from "app/Components/Layouts/Pages/ProfilePage.component";

SplashScreen.preventAutoHideAsync();

export default class App extends Component {
    pages = {
        "/index": (<LandingPage onNavigate={(page) => this.setState({ page })}/>),
        "/record": (<RecordPage onNavigate={(page) => this.setState({ page })}/>),
        "/profile": (<ProfilePage onNavigate={(page) => this.setState({ page })}/>),
        "/settings": (<SettingsPage onNavigate={(page) => this.setState({ page })}/>),
        "/login": (<LoginPage onNavigate={(page) => this.setState({ page })}/>)
    };

    async componentDidMount() {
        try { await Location.requestForegroundPermissionsAsync(); } catch {}
        try { await Location.requestBackgroundPermissionsAsync(); } catch {}

        // uncomment to debug login dialog
        // await Config.resetAsync();

        await Config.readAsync();
        Appearance.readConfig();

        if(Config.user?.token) {
            User.authenticateAsync().then((success) => {
                if(!success)
                    this.setState({ page: "/login" });
            });
        }
        else if(Config.user.guest == null)
            this.setState({ page: "/login" });

        await SplashScreen.hideAsync();
    
        //Appearance.addEventListener("change", (theme) => this.setState({ theme }));

        this.setState({ page: "/index" });
    };

    render() {
        if(!this.state?.page)
            return null;

        if(User.guest) {
            switch(this.state.page) {
                case "/record":
                    return (<LoginPage onNavigate={(page) => this.setState({ page })}/>);
            }
        }
        
        if(Platform.OS == "android") {
            NavigationBar.setBackgroundColorAsync(Appearance.theme.colorPalette.common);
            NavigationBar.setButtonStyleAsync(Appearance.theme.colorPalette.contrast);
        }

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Appearance.theme.colorPalette.common
                }}
                >
                <StatusBar style={Appearance.theme.colorPalette.contrast}/>

                {this.pages[this.state.page]}
            </View>
        );
    };
};
