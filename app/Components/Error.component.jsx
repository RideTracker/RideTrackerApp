import React from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Appearance from "app/Data/Appearance";

import ThemedComponent from "app/Components/ThemedComponent";

import style from "./Error.component.style";

export default class Error extends ThemedComponent {
    style = style.update();

    render() {
        const color = {
            color: this.props?.color ?? Appearance.theme.colorPalette.routeDarker
        };

        return (
            <View style={style.sheet}>
                <View style={style.sheet.content}>
                    <FontAwesome5 style={[ style.sheet.icon, color ]} name={"exclamation-triangle"}/>

                    <Text style={[ style.sheet.title, color ]}>Something went wrong!</Text>
                    <Text style={[ style.sheet.description, color ]}>{this.props.description}</Text>
                </View>
            </View>
        );
    }
};
