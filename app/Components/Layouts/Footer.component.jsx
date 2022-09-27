import React, { Component } from "react";
import { Text, View, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ThemedComponent from "app/Components/ThemedComponent";
import Appearance from "app/Data/Appearance";

import Pages from "app/Data/Config/Pages.json";

import style from "./Footer.component.style";

export default class Footer extends ThemedComponent {
    style = style.update();

    componentDidUpdate() {
        if(!this.state?.systemeThemeChanged && Appearance.hasSystemThemeChanged())
            this.setState({ systemeThemeChanged: true });
    }

    render() {
        return (
            <View style={style.sheet}>
                <View style={style.sheet.container}>
                    {Pages.map((page) => (
                        <TouchableOpacity key={page.path} style={style.sheet.container.button} onPress={() => this.props.onNavigate(page.path)}>
                            <FontAwesome5 style={style.sheet.container.button.icon} name={page.icon}/>

                            <Text style={style.sheet.container.button.text}>{page.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {this.state?.systemeThemeChanged && (
                    <View style={style.sheet.appearance}>
                        <Text style={style.sheet.appearance.text}>We've turned on {Appearance.theme.id} mode for you to match your device's appearance mode!</Text>
                    </View>
                )}
            </View>
        );
    }
};
