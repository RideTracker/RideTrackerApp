import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";

import Header from "../Layouts/Header.component";
import Footer from "../Layouts/Footer.component";

import Themes from "../Data/Themes.json";

import style from "./SettingsPage.component.style";

export default class SettingsPage extends Component {
    render() { 
        return (
            <View style={style}>
                <Header title="Settings"/>

                <ScrollView>
                    <View style={style.section}>
                        <Text style={style.section.title}>Appearance</Text>

                        <View style={style.section.select}>
                            {Themes.map((theme) => (
                                <TouchableOpacity key={theme.id} style={style.section.select.option}>
                                    <Text style={style.section.select.option.title}>{theme.title}</Text>
                                    <Text style={style.section.select.option.description}>{theme.description}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
                
                <Footer onPress={(page) => this.props.onPageNavigation(page)}/>
            </View>
        );
    }
};
