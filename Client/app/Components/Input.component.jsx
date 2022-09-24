import { Component } from "react";
import { View, TextInput } from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Appearance from "../Data/Appearance";

import style from "./Input.component.style";

export default class Input extends Component {
    style = style.update();

    render() {
        return (
            <View style={[ style.sheet, this.props?.style ]}>
                {this.props?.icon && (
                    <View style={style.sheet.icon}>
                        <FontAwesome5 style={style.sheet.icon.text} name={this.props?.icon} solid/>
                    </View>
                )}

                <TextInput style={style.sheet.input} placeholder={this.props?.placeholder} placeholderTextColor={Appearance.theme.colorPalette.secondary}/>
            </View>
        );
    };
};
