import React, { Component } from "react";
import { View, ScrollView } from "react-native";

import Header from "../../Header.component";
import Footer from "../../Footer.component";

import style from "./Register.component.style";

export default class Register extends Component {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet}>
                <Header title="Register" navigation onNavigationPress={() => this.props?.onClose()}/>

                <ScrollView></ScrollView>
            </View>
        );
    }
};
