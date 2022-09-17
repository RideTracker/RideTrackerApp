import React, { Component } from "react";
import { View } from 'react-native';

import LandingPage from "../Pages/LandingPage.component";
import ProfilePage from "../Pages/ProfilePage.component";
import RecordPage from "../Pages/RecordPage.component";

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
