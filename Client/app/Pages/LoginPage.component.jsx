import React, { Component } from "react";
import { View, ScrollView, Text } from "react-native";

import * as AppleAuthentication from 'expo-apple-authentication';

import ThemedComponent from "../Components/ThemedComponent";

import Header from "../Layouts/Header.component";
import Footer from "../Layouts/Footer.component";

import style from "./LoginPage.component.style";

export default class LoginPage extends ThemedComponent {
    style = style.update();

    render() { 
        return (
            <View style={style.sheet}>
                <Header title="Login"/>

                <View>
                    <Text>Hey</Text>
                    <Text>Hey</Text>
                    <Text>Hey</Text>
                    <Text>Hey</Text>
                    <Text>Hey</Text>
                    <Text>Hey</Text>
                    <Text>Hey</Text>
                    <Text>Hey</Text>
                    <Text>Hey</Text>
                    <AppleAuthentication.AppleAuthenticationButton
                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                        cornerRadius={5}
                        style={{ width: 200, height: 44 }}
                        onPress={async () => {
                            try {
                            const credential = await AppleAuthentication.signInAsync({
                                requestedScopes: [
                                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                ],
                            });
                            // signed in
                            } catch (e) {
                            if (e.code === 'ERR_CANCELED') {
                                // handle that the user canceled the sign-in flow
                            } else {
                                // handle other errors
                            }
                            }
                        }}
                        />
                </View>
            </View>
        );
    }
};
