import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";

import Appearance from "app/Data/Appearance";
import Themes from "app/Data/Config/Themes.json";

import ThemedComponent from "app/Components/ThemedComponent";

import Header from "app/Components/Layouts/Header.component";
import Footer from "app/Components/Layouts/Footer.component";

import style from "./SettingsPage.component.style";

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
                
                <Footer onNavigate={(path) => this.props.onNavigate(path)}/>
            </View>
        );
    }
};
