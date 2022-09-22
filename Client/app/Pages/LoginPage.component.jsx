import React, { Component } from "react";
import { View, Platform, TextInput, Text } from "react-native";

import * as AppleAuthentication from "expo-apple-authentication";

import ThemedComponent from "../Components/ThemedComponent";

import Header from "../Layouts/Header.component";
import Footer from "../Layouts/Footer.component";

import style from "./LoginPage.component.style";
import Button from "../Components/Button.component";

export default class LoginPage extends ThemedComponent {
    style = style.update();

    async onAppleLoginPress() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            console.log(credential);
        }
        catch(error) {
            if(error.code == "ERR_CANCELED") {

            } else {

            }
        }
    };

    render() { 
        return (
            <View style={style.sheet}>
                <Header title="Login"/>

                <View style={style.sheet.form}>
                    <TextInput style={style.sheet.form.input} placeholder="E-mail address"/>
                    <TextInput style={style.sheet.form.input} placeholder="Password"/>

                    <Button style={style.sheet.form.button} margin={0} title="Sign in"/>

                    <View style={style.sheet.form.divider}>
                        <View style={style.sheet.form.divider.line} />

                        <View>
                            <Text style={style.sheet.form.divider.text}>OR</Text>
                        </View>

                        <View style={style.sheet.form.divider.line} />
                    </View>

                    {Platform.OS == "ios" && (
                        <AppleAuthentication.AppleAuthenticationButton style={style.sheet.form.button}
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            cornerRadius={5}
                            onPress={() => this.onAppleLoginPress()}
                        />
                    )}

                    {Platform.OS == "android" && (
                        <Button title="detta ar apple login på ios"/>
                    )}
                </View>
            </View>
        );
    }
};
