import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";

import ThemedComponent from "app/Components/ThemedComponent";

import style from "./Button.component.style";

export default class Button extends ThemedComponent {
    style = style.update();

    onPress() {
        if(this.props.confirm != undefined) {
            Alert.alert(
                this.props.confirm.title ?? "Are you sure?",
                this.props.confirm.message ?? "Do you really want to perform this action?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: () => this.props.onPress() }
                ]
            );

            return;
        }
        
        this.props.onPress();
    };

    render() { 
        return (
            <TouchableOpacity style={[ style.sheet, (this.props.branded != undefined && style.sheet.branded), (this.props.confirm != undefined && style.sheet.confirm), (this.props.margin != undefined && style.sheet.noMargin), (this.props.style != undefined && this.props.style) ]} onPress={() => this.onPress()}>
                <Text style={[ style.sheet.text, (this.props.confirm != undefined && style.sheet.confirm.text) ]}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
};
