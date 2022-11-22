import React, { Component } from "react";
import { View, ScrollView } from "react-native";

import { Page } from "app/Components";

import style from "./Forgotten.style";

export default class Forgotten extends Component {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet}>
                <Page.Header title="Forgotten" navigation onNavigationPress={() => this.props?.onClose()}/>

                <ScrollView></ScrollView>
            </View>
        );
    }
};
