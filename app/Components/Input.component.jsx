import { Component } from "react";
import { View, TextInput } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Appearance from "app/Data/Appearance";

import style from "./Input.component.style";

export default class Input extends Component {
    style = style.update();

    getValue() {
        return this.state?.value;
    };

    render() {
        return (
            <View style={[ style.sheet, ((this.props?.border ?? true) && style.sheet.border), this.props?.style ]}>
                {this.props?.icon && (
                    <View style={style.sheet.icon}>
                        <FontAwesome5 style={style.sheet.icon.text} name={this.props?.icon} solid={this.props?.solid ?? true}/>
                    </View>
                )}

                <TextInput onChangeText={(text) => this.setState({ value: text })} style={[ style.sheet.input, (!this.props?.icon && { paddingLeft: 12 }) ]} placeholder={this.props?.placeholder} placeholderTextColor={Appearance.theme.colorPalette.secondary} secureTextEntry={this.props?.secure}/>
            </View>
        );
    };
};
