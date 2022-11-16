import React from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import ThemedComponent from "app/Components/ThemedComponent";

import style from "./Error.component.style";

export default class Error extends ThemedComponent {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet}>
                <View style={style.sheet.content}>
                    <FontAwesome5 style={[ style.sheet.icon, (this.props?.darker)?(style.sheet.darker):(style.sheet.light) ]} name={"exclamation-triangle"}/>

                    <Text style={[ style.sheet.title, (this.props?.darker)?(style.sheet.darker):(style.sheet.light) ]}>Something went wrong!</Text>
                    <Text style={[ style.sheet.description, (this.props?.darker)?(style.sheet.darker):(style.sheet.light) ]}>{this.props.description}</Text>
                </View>
            </View>
        );
    }
};
