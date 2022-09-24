import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";

import ThemedComponent from "../../Components/ThemedComponent";

import Header from "../../Layouts/Header.component";
import Footer from "../../Layouts/Footer.component";

import Themes from "../../Data/Config/Themes.json";

import style from "./SettingsPage.component.style";
import Appearance from "../../Data/Appearance";

export default class SettingsPage extends ThemedComponent {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet}>
                <Header title="Settings"/>

                <ScrollView>
                    <View style={style.sheet.section}>
                        <Text style={style.sheet.section.title}>Appearance</Text>

                        <View style={style.sheet.section.select}>
                            {Themes.map((theme) => (
                                <TouchableOpacity key={theme.id} style={style.sheet.section.select.option} onPress={() => Appearance.setTheme(theme.id)}>
                                    <Text style={style.sheet.section.select.option.title}>{theme.title}</Text>
                                    <Text style={style.sheet.section.select.option.description}>{theme.description}</Text>
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
