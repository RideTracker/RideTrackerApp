import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Svg, { Path } from "react-native-svg";

import ThemedComponent from "../Components/ThemedComponent";

import style from "./Header.component.style";

export default class Header extends ThemedComponent {
    style = style.update();

    render() { 
        return (
            <View style={[style.sheet, this.props?.branded && style.sheet.branded ]} theme={this.state?.theme}>
                <Text style={style.sheet.feed}>{this.props.title}</Text>

                {this.props?.wavy && (
                    <Svg style={style.sheet.branded.wave} width="100%" viewBox="0 0 1440 320">
                        <Path fill-opacity="1" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,53.3C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"/>
                    </Svg>
                )}

                {this.props?.navigation && (
                    <TouchableOpacity style={[ style.sheet.button, style.sheet.navigation ]} onPress={this.props.onNavigationPress}>
                        <FontAwesome5 style={style.sheet.button.icon} name={"times"}/>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
};
