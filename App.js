import { Component, useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import uuid from "react-native-uuid";

import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import LoginPage from "app/Components/Layouts/Pages/LoginPage.component";

import Config from "app/Data/Config";
import User from "app/Data/User";
import Appearance from "app/Data/Appearance";

import Footer from "app/Components/Layouts/Footer.component";

import LandingPage from "app/Components/Layouts/Pages/LandingPage.component";
import RecordPage from "app/Components/Layouts/Pages/RecordPage.component";
import SettingsPage from "app/Components/Layouts/Pages/SettingsPage.component";
import ProfilePage from "app/Components/Layouts/Pages/ProfilePage.component";

SplashScreen.preventAutoHideAsync();

export default class App extends Component {
    showModal(component) {
        const key = uuid.v4();

        const modals = this.state?.modals ?? [];
        modals.push({ key, component });

        this.setState({ modals });

        return key;
    };

    hideModal(key) {
        const modals = this.state.modals.filter((modal) => modal.key != key);

        this.setState({ modals });
    };

    pages = {
        "/index": (<LandingPage showModal={(...args) => this.showModal(...args)} hideModal={(...args) => this.hideModal(...args)} onNavigate={(page) => this.setState({ page })}/>),
        "/record": (<RecordPage showModal={(...args) => this.showModal(...args)} hideModal={(...args) => this.hideModal(...args)} onNavigate={(page) => this.setState({ page })}/>),
        "/profile": (<ProfilePage showModal={(...args) => this.showModal(...args)} hideModal={(...args) => this.hideModal(...args)} onNavigate={(page) => this.setState({ page })}/>),
        "/settings": (<SettingsPage showModal={(...args) => this.showModal(...args)} hideModal={(...args) => this.hideModal(...args)} onNavigate={(page) => this.setState({ page })}/>)
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
                if(!success) {
                    const modal = this.showModal(<LoginPage onClose={() => this.hideModal(modal)}/>);
                }
            });
        }
        else if(Config.user.guest == null) {
            const modal = this.showModal(<LoginPage onClose={() => this.hideModal(modal)}/>);
        }

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

                <Footer onNavigate={(page) => this.setState({ page })}/>

                {this.state?.modals && this.state.modals.map((modal) => (
                    <View key={modal.key} style={{
                        position: "absolute",
                        
                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%"
                    }}>
                        {modal.component}
                    </View>
                ))}
            </View>
        );
    };
};
