import React, { Component } from "react";
import { Image, PixelRatio, View, Text, TouchableOpacity } from "react-native";

import Header from "app/Components/Layouts/Header.component";

import style from "./Bike.style";

export default class Bike extends Component {
    style = style.update();

    render() {
        return (
            <View style={style.sheet}>
                <Header
                    title="Bike"
                    navigation="true"
                    onNavigationPress={() => this.props.onClose()}
                    />
            </View>
        );
    };
};
