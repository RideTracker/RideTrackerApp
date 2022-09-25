import React from "react";
import { View, Platform, Text, TouchableOpacity } from "react-native";

import * as AppleAuthentication from "expo-apple-authentication";

import Config from "../../Data/Config";
import User from "../../Data/User";
import API from "../../API";

import ThemedComponent from "../../Components/ThemedComponent";
import Input from "../../Components/Input.component";

import Forgotten from "./Login/Forgotten.component";
import Register from "./Login/Register.component";

import style from "./LoginPage.component.style";
import Button from "../../Components/Button.component";

export default class LoginPage extends ThemedComponent {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.email = React.createRef();
        this.password = React.createRef();
    };

    onClose() {
        this.setState({ closed: true });
    };

    async onAppleAuthenticationPress() {
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

    onGuestPress() {
        Config.user.guest = true;
        Config.saveAsync();

        this.setState({ closed: true });
    };

    async onLoginPress() {
        const credentials = {
            email: this.email.current.getValue(),
            password: this.password.current.getValue()
        };

        const response = await API.post("/api/user/login", JSON.stringify(credentials));

        if(!response.success) {
            Alert.alert("Something went wrong!", response.content, [{ text: "Close" }]);

            return;
        }

        Config.user.guest = false;
        Config.user.token = response.content;
        Config.saveAsync();

        await User.authenticateAsync();

        if(!User.guest)
            this.setState({ closed: true });
    };

    render() { 
        if(this.state?.closed)
            return null;

        if(this.state?.page) {
            if(this.state?.page == "register")
                return (<Register style={style.sheet} onRegistration={() => this.setState({ closed: true })} onClose={() => this.setState({ page: null })}/>);
            else if(this.state?.page == "forgotten")
                return (<Forgotten style={style.sheet} onClose={() => this.setState({ page: null })}/>);
        }

        return (
            <View style={style.sheet}>
                <View style={style.sheet.form}>
                    <Text style={style.sheet.header}>Ride Tracker</Text>

                    <Input ref={this.email} style={style.sheet.form.input} placeholder="E-mail address" icon="envelope"/>
                    <Input ref={this.password} style={style.sheet.form.input} placeholder="Password" icon="lock" secure/>

                    <Button style={style.sheet.form.button} margin={0} branded={true} title="Sign in" onPress={() => this.onLoginPress()}/>

                    <TouchableOpacity onPress={() => this.setState({ page: "forgotten" })}>
                        <Text style={style.sheet.text}>Forgot your credentials? <Text style={style.sheet.text.link}>Click here to recover</Text></Text>
                    </TouchableOpacity>

                    <View style={style.sheet.form.divider}>
                        <View style={style.sheet.form.divider.line}/>
                        <Text style={style.sheet.form.divider.text}>OR</Text>
                        <View style={style.sheet.form.divider.line}/>
                    </View>

                    {Platform.OS == "ios" && (
                        <AppleAuthentication.AppleAuthenticationButton style={style.sheet.form.button}
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                            cornerRadius={5}
                            onPress={() => this.onAppleAuthenticationPress()}
                        />
                    )}

                    <Button style={style.sheet.form.button} onPress={() => this.onGuestPress()} title="Continue as a guest"/>
                </View>

                <View style={style.sheet.footer}>
                    <TouchableOpacity onPress={() => this.setState({ page: "register" })}>
                        <Text style={style.sheet.text}>Don't have an account? <Text style={style.sheet.text.link}>Click here to sign up</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};
