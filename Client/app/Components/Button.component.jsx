import React, { Component } from "react";
import { TouchableOpacity, Text, Alert } from "react-native";

import style from "./Button.component.style";

export default class Button extends Component {
    onPress() {
        if(this.props.confirm != undefined) {
            Alert.alert(
                this.props.confirm.title ?? "Are you sure?",
                this.props.confirm.message ?? "Do you really want to perform this action?",
                [
                    { text: "Yes", onPress: () => this.props.onPress() },
                    { text: "Cancel", style: "cancel" }
                ]
            );

            return;
        }
        
        this.props.onPress();
    };

    render() { 
        return (
            <TouchableOpacity style={[ style, (this.props.confirm != undefined && style.confirm) ]} onPress={() => this.onPress()}>
                <Text style={[ style.text, (this.props.confirm != undefined && style.confirm.text) ]}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
};
