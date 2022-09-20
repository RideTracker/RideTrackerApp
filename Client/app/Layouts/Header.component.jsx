import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import ThemedComponent from "../Components/ThemedComponent";

import style from "./Header.component.style";

export default class Header extends ThemedComponent {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet} theme={this.state?.theme}>
                <Text style={style.sheet.feed}>{this.props.title}</Text>

                {this.props.navigation != undefined &&
                    <TouchableOpacity style={[ style.sheet.button, style.sheet.navigation ]} onPress={this.props.onNavigationPress}>
                        <FontAwesome5 style={style.sheet.button.icon} name={"times"}/>
                    </TouchableOpacity>
                }
            </View>
        );
    }
};
