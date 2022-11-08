import React from "react";
import { View, ScrollView, Text, TouchableOpacity, Switch } from "react-native";

import Config from "app/Data/Config";
import Appearance from "app/Data/Appearance";
import Themes from "app/Data/Config/Themes.json";

import ThemedComponent from "app/Components/ThemedComponent";
import Button from "app/Components/Button.component";

import Header from "app/Components/Layouts/Header.component";

import style from "./SettingsPage.component.style";
import Production from "../../../Services/Production";

export default class SettingsPage extends ThemedComponent {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet}>
                <Header title="Settings"/>

                <ScrollView>
                    {(Production.get() == "demo") && (
                        <View style={style.sheet.section}>
                            <Text style={style.sheet.section.title}>Production Mode</Text>

                            <Text style={style.sheet.section.switch.text.description}>You are in a less accessible production environment.</Text>
                            
                            <Button transparent style={{ marginTop: 12 }} title={"View information prompt"} onPress={() => Production.prompt()}/>
                        </View>
                    )}

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

                    <View style={style.sheet.section}>
                        <Text style={style.sheet.section.title}>Activities</Text>

                        <View style={style.sheet.section.switch}>
                            <View style={style.sheet.section.switch.text}>
                                <Text style={style.sheet.section.switch.text.title}>Map Matching</Text>
                                <Text style={style.sheet.section.switch.text.description}>If enabled, we will show activity maps aligned to the closest roads.</Text>
                            </View>

                            <Switch
                                style={style.sheet.section.switch.button}
                                trackColor={{ false: "#767577", true: Appearance.theme.colorPalette.route }}
                                thumbColor={false ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(value) => {
                                    Config.user.mapMatching = value;

                                    Config.saveAsync();

                                    this.setState({ mapMatching: value });
                                }}
                                value={Config.user?.mapMatching}
                                />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
};
