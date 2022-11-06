import React, { Component } from "react";
import { View, ScrollView, Text, Alert } from "react-native";

import API from "app/Services/API";
import Config from "app/Data/Config";
import User from "app/Data/User";

import Input from "app/Components/Input.component";
import Button from "app/Components/Button.component";

import Header from "../../Header.component";

import style from "./Register.component.style";

export default class Register extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.firstname = React.createRef();
        this.lastname = React.createRef();
        this.email = React.createRef();
        this.password = React.createRef();
    };

    async onRegistration() {
        const credentials = {
            firstname: this.firstname.current.getValue(),
            lastname: this.lastname.current.getValue(),
            email: this.email.current.getValue(),
            password: this.password.current.getValue()
        };

        const response = await API.post("/api/user/register", credentials);

        if(!response.success) {
            Alert.alert("Something went wrong!", response.content, [{ text: "Close" }]);

            return;
        }

        Config.user.guest = false;
        Config.user.token = response.content;
        Config.saveAsync();

        await User.authenticateAsync();

        this.props.onRegistration();      
    };

    render() { 
        return (
            <View style={style.sheet}>
                <Header title="Register" navigation onNavigationPress={() => this.props?.onClose()}/>

                <ScrollView style={style.sheet.form}>
                    <View>
                        <Text style={[ style.sheet.form.input, style.sheet.form.text ]}>What's your name?</Text>
                        <Text style={[ style.sheet.form.input, style.sheet.form.description ]}>This will be visible to everyone but you can choose to hide your lastname in your profile privacy settings.</Text>

                        <View style={[ style.sheet.form.input, style.sheet.form.multiInput ]}>
                            <View style={[ style.sheet.form.multiInput.input, { paddingRight: 6 } ]}>
                                <Input
                                    ref={this.firstname}
                                    placeholder="Firstname"
                                    autoComplete={"name-given"}
                                    clearButtonMode={"while-editing"}
                                    enablesReturnKeyAutomatically={true}
                                    keyboardType={"default"}
                                    autoCapitalize={"words"}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => this.lastname.current.focus()}
                                    />
                            </View>

                            <View style={[style.sheet.form.multiInput.input, { paddingLeft: 6 } ]}>
                                <Input
                                    ref={this.lastname}
                                    placeholder="Lastname"
                                    autoComplete={"name-family"}
                                    clearButtonMode={"while-editing"}
                                    enablesReturnKeyAutomatically={true}
                                    keyboardType={"default"}
                                    autoCapitalize={"words"}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => this.email.current.focus()}
                                    />
                            </View>
                        </View>
                    </View>

                    <View style={style.sheet.form.divider}/>

                    <View>
                        <Text style={[ style.sheet.form.input, style.sheet.form.text ]}>What's your e-mail address?</Text>
                        <Text style={[ style.sheet.form.input, style.sheet.form.description ]}>You will use this to login but we won't show it to other users!</Text>

                        <Input
                            ref={this.email}
                            style={style.sheet.form.input}
                            placeholder="E-mail address"
                            autoComplete={"email"}
                            clearButtonMode={"while-editing"}
                            enablesReturnKeyAutomatically={true}
                            keyboardType={"email-address"}
                            autoCapitalize={"none"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.password.current.focus()}
                            />
                    </View>

                    <View style={style.sheet.form.divider}/>

                    <View>
                        <Text style={[ style.sheet.form.input, style.sheet.form.text ]}>Choose your password:</Text>
                        <Text style={[ style.sheet.form.input, style.sheet.form.description ]}>You can skip having a password by using one of our other login options, such as Apple or Google login!</Text>

                        <Input
                            ref={this.password}
                            style={style.sheet.form.input}
                            placeholder="Password"
                            autoComplete={"password"}
                            autoCorrect={false}
                            clearTextOnFocus={true}
                            clearButtonMode={"while-editing"}
                            enablesReturnKeyAutomatically={true}
                            autoCapitalize={"none"}
                            returnKeyType={"send"}
                            onSubmitEditing={() => this.onRegistration()}
                            secure
                            />
                    </View>
                </ScrollView>

                <View style={style.sheet.form}>
                    <Button style={style.sheet.form.input} title="Finish registration" branded onPress={() => this.onRegistration()}/>
                    <Button style={style.sheet.form.input} title="Cancel" onPress={() => this.props?.onClose()}/>
                </View>
            </View>
        );
    }
};
