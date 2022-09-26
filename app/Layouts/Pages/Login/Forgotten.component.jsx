import React, { Component } from "react";
import { View, ScrollView } from "react-native";

import Header from "../../../Layouts/Header.component";
import Footer from "../../../Layouts/Footer.component";

import style from "./Forgotten.component.style";

export default class Forgotten extends Component {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet}>
                <Header title="Forgotten" navigation onNavigationPress={() => this.props?.onClose()}/>

                <ScrollView></ScrollView>
            </View>
        );
    }
};
