import React, { Component } from "react";
import { View, Platform, TextInput, Text, Image, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";

import * as AppleAuthentication from "expo-apple-authentication";

import ThemedComponent from "../Components/ThemedComponent";
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
                <Header style={style.sheet.header} branded={true} wavy={true} navigation={true} onNavigationPress={() => this.onClose()} title="Ride Tracker"/>

                <ScrollView style={style.sheet.form}>
                    <TextInput style={style.sheet.form.input} placeholder="E-mail address" placeholderTextColor={Appearance.theme.colorPalette.secondary}/>
                    <TextInput style={style.sheet.form.input} placeholder="Password" placeholderTextColor={Appearance.theme.colorPalette.secondary}/>

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
                </ScrollView>

                <View style={style.sheet.footer}>
                    <Svg style={style.sheet.footer.svg} height="" width="100%" viewBox="0 0 1440 320">
                        <Path fill-opacity="1" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,53.3C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
                    </Svg>

                    <View style={style.sheet.footer.content}>
                        <Image
                            style={style.sheet.footer.content.icon}
                            source={require("./../../assets/icon_light.png")}
                        />

                        <View style={style.sheet.footer.content.text}>
                            <Text style={style.sheet.footer.content.title}>Become a member to...</Text>
                            <Text style={style.sheet.footer.content.description}>Upload and share your rides.{"\n"}Comment on other people's rides.{"\n"}View a lot of stats about your rides.{"\n"}Plan and export map routes.</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
};
