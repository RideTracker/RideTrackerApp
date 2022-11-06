import React from "react";
import { View } from 'react-native';

import User from "app/Data/User";

import ThemedComponent from "app/Components/ThemedComponent";

import LandingPage  from "app/Components/Layouts/Pages/LandingPage.component";
import RecordPage   from "app/Components/Layouts/Pages/RecordPage.component";
import ProfilePage  from "app/Components/Layouts/Pages/ProfilePage.component";
import SettingsPage from "app/Components/Layouts/Pages/SettingsPage.component";

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
