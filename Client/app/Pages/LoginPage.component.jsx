import React, { Component } from "react";
import { View, Platform, TextInput, Text, Image } from "react-native";
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
                <View style={style.sheet.header}>
                    <View style={style.sheet.header.content}>
                        <Image
                            style={style.sheet.header.content.icon}
                            source={require("./../../assets/icon_light.png")}
                        />

                        <View style={style.sheet.header.content.text}>
                            <Text style={style.sheet.header.content.title}>Become a member to...</Text>
                            <Text style={style.sheet.header.content.description}>Upload and share your rides.{"\n"}Comment on other people's rides.{"\n"}View a lot of stats about your rides.{"\n"}Plan and export map routes.</Text>
                        </View>
                    </View>
                    
                    <Svg style={style.sheet.header.svg} height="" width="100%" viewBox="0 0 1440 320">
                        <Path fill-opacity="1" d="M0,96L30,122.7C60,149,120,203,180,208C240,213,300,171,360,160C420,149,480,171,540,165.3C600,160,660,128,720,117.3C780,107,840,117,900,138.7C960,160,1020,192,1080,218.7C1140,245,1200,267,1260,261.3C1320,256,1380,224,1410,208L1440,192L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"/>
                    </Svg>
                </View>

                <View style={style.sheet.form}>
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
                </View>
            </View>
        );
    }
};
