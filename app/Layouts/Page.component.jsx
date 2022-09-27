import React, { Component } from "react";
import { View } from 'react-native';

import User from "app/Data/User";

import ThemedComponent from "../Components/ThemedComponent";

import LandingPage from "./Pages/LandingPage.component";
import RecordPage from "./Pages/RecordPage.component";
import ProfilePage from "./Pages/ProfilePage.component";
import SettingsPage from "./Pages/SettingsPage.component";
import LoginPage from "./Pages/LoginPage.component";

import style from "./Page.component.style";

export default class Page extends ThemedComponent {
    style = style.update();

    constructor(...args) {
        super(...args);

        User.authenticateAsync().then((success) => {
            if(!success)
                this.setState({ showLogin: true });
        });
    };

    getPage() {
        switch(this.state?.page) {
            case "home":
                return LandingPage;
                
            case "record":
                return RecordPage;
                
            case "profile":
                return ProfilePage;
                
            case "settings":
                return SettingsPage;

            default:
                return LandingPage;
        } 
    }

    render() { 
        const component = {
            page: this.getPage()
        };

        return (
            <View style={style.sheet}>
                <component.page onPageNavigation={(page) => this.setState({page})}/>
            </View>
        );
    }
};
