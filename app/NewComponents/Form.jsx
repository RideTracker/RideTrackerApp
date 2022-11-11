import { Component } from "react";
import { View, Text } from "react-native";

import Appearance from "app/Data/Appearance";

import Input from "app/Components/Input.component";

export default class Form extends Component {
    render() {
        return (
            <View style={{
                marginVertical: 12
            }}>
                {this.props.children}
            </View>
        );
    };

    static Field = (props) => {
        return (
            <View style={{
                marginVertical: 6
            }}>
                {props.children}
            </View>
        );
    };

    static Title = (props) => {
        return (
            <Text style={{
                marginVertical: 4,

                color: Appearance.theme.colorPalette.secondary,

                fontSize: 16,
                fontWeight: "bold"
            }}>
                {props.text}
            </Text>
        );
    };

    static Description = (props) => {
        return (
            <Text style={{
                marginVertical: 4,

                color: Appearance.theme.colorPalette.secondary,

                fontSize: 14
            }}>
                {props.text}
            </Text>
        );
    };

    static Input = Input;
};
