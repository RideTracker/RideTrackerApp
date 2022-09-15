import React, { Component } from "react";
import { View, ScrollView } from "react-native";

import Header from "../layout/Header.component";
import Footer from "../layout/Footer.component";

import style from "./ProfilePage.component.style";

export default class ProfilePage extends Component {
    render() { 
        return (
            <View style={style}>
                <Header title="Profile"/>

                <ScrollView></ScrollView>
                
                <Footer onPress={(page) => this.props.onPageNavigation(page)}/>
            </View>
        );
    }
};
