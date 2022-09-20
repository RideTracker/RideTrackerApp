import React, { Component } from "react";
import { Text, View, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Pages from "../Data/Pages.json";

import style from "./Footer.component.style";

export default class Footer extends Component {
    render() { 
        return (
            <View style={style}>
                <View style={style.container}>
                    {Pages.map((page) => (
                        <TouchableOpacity key={page.id} style={style.container.button} onPress={() => this.props.onPress(page.id)}>
                            <FontAwesome5 style={style.container.button.icon} name={page.icon}/>

                            <Text style={style.container.button.text}>{page.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    }
};
