import React, { Component } from "react";
import { View } from 'react-native';

import LandingPage from "../Pages/LandingPage.component";
import RecordPage from "../Pages/RecordPage.component";
import ProfilePage from "../Pages/ProfilePage.component";
import SettingsPage from "../Pages/SettingsPage.component";

import style from "./Page.component.style";

export default class Page extends Component {
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
            <View style={style}>
                <component.page onPageNavigation={(page) => this.setState({page})}/>
            </View>
        );
    }
};
