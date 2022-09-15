import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import style from "./Header.component.style";

export default class Header extends Component {
    render() { 
        return (
            <View style={style}>
                <Text style={style.feed}>{this.props.title}</Text>

                {this.props.navigation != undefined &&
                    <TouchableOpacity style={[ style.button, style.navigation ]} onPress={this.props.onNavigationPress}>
                        <FontAwesome5 style={style.button.icon} name={"times"}/>
                    </TouchableOpacity>
                }
            </View>
        );
    }
};
