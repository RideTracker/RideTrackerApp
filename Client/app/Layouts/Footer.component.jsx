import React, { Component } from "react";
import { Text, View, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ThemedComponent from "../Components/ThemedComponent";
import Appearance from "../Data/Appearance";

import Pages from "../Data/Pages.json";

import style from "./Footer.component.style";

export default class Footer extends ThemedComponent {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet}>
                <View style={style.sheet.container}>
                    {Pages.map((page) => (
                        <TouchableOpacity key={page.id} style={style.sheet.container.button} onPress={() => this.props.onPress(page.id)}>
                            <FontAwesome5 style={style.sheet.container.button.icon} name={page.icon}/>

                            <Text style={style.sheet.container.button.text}>{page.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    }
};
