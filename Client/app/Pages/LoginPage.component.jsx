import React, { Component } from "react";
import { View, Platform, TextInput, Text, Image, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";

import * as AppleAuthentication from "expo-apple-authentication";

import ThemedComponent from "../Components/ThemedComponent";
import Input from "../Components/Input.component";
import Appearance from "../Data/Appearance";

import Header from "../Layouts/Header.component";
import Footer from "../Layouts/Footer.component";

import style from "./LoginPage.component.style";
import Button from "../Components/Button.component";

export default class LoginPage extends ThemedComponent {
    style = style.update();

    onClose() {
        this.setState({ closed: true });
    };

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
        if(this.state?.closed == true)
            return null;

        return (
            <View style={style.sheet}>
                <View style={style.sheet.form}>
                    <Text style={style.sheet.header}>Ride Tracker</Text>

                    <Input style={style.sheet.form.input} placeholder="E-mail address" icon="envelope"/>
                    <Input style={style.sheet.form.input} placeholder="Password" icon="lock"/>

                    <Button style={style.sheet.form.button} margin={0} branded={true} title="Sign in"/>

                    <Text style={style.sheet.text}>Forgot your credentials? <Text style={style.sheet.text.link}>Click here to recover</Text></Text>

                    <View style={style.sheet.form.divider}>
                        <View style={style.sheet.form.divider.line}/>

                        <View>
                            <Text style={style.sheet.form.divider.text}>OR</Text>
                        </View>

                        <View style={style.sheet.form.divider.line}/>
                    </View>

                    {Platform.OS == "ios" && (
                        <AppleAuthentication.AppleAuthenticationButton style={style.sheet.form.button}
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            cornerRadius={5}
                            onPress={() => this.onAppleLoginPress()}
                        />
                    )}

                    <Button style={style.sheet.form.button} title="Continue as a guest"/>
                </View>

                <View style={style.sheet.footer}>
                    <Text style={style.sheet.text}>Don't have an account? <Text style={style.sheet.text.link}>Click here to sign up</Text></Text>
                </View>
            </View>
        );
    }
};
