import React, { Component } from "react";
import { View } from 'react-native';

import LandingPage from "../pages/LandingPage.component";
import ProfilePage from "../pages/ProfilePage.component";
import RecordPage from "../pages/RecordPage.component";

import style from "./Pages.component.style";

export default class Pages extends Component {
    renderPage() {
        if(this.state == null || this.state.page == "home")
            return (<LandingPage onPageNavigation={(page) => this.setState({ page })}/>);
        
        if(this.state.page == "profile")
            return (<ProfilePage onPageNavigation={(page) => this.setState({ page })}/>);
        
        if(this.state.page == "record")
            return (<RecordPage onPageNavigation={(page) => this.setState({ page })}/>);
    }

    render() { 
        return (
            <View style={style}>
                {this.renderPage()}
            </View>
        );
    }
};
