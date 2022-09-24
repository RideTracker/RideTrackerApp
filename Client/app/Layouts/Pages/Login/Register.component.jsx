import React, { Component } from "react";
import { View, ScrollView, Text } from "react-native";

import Input from "../../../Components/Input.component";
import Button from "../../../Components/Button.component";

import Header from "../../Header.component";
import Footer from "../../Footer.component";

import style from "./Register.component.style";

export default class Register extends Component {
    style = style.update();

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
                                <Input placeholder="Firstname"/>
                            </View>

                            <View style={[style.sheet.form.multiInput.input, { paddingLeft: 6 } ]}>
                                <Input placeholder="Lastname"/>
                            </View>
                        </View>
                    </View>

                    <View style={style.sheet.form.divider}/>

                    <View>
                        <Text style={[ style.sheet.form.input, style.sheet.form.text ]}>What's your e-mail address?</Text>
                        <Text style={[ style.sheet.form.input, style.sheet.form.description ]}>You will use this to login but we won't show it to other users!</Text>

                        <Input style={style.sheet.form.input} placeholder="E-mail address"/>
                    </View>

                    <View style={style.sheet.form.divider}/>

                    <View>
                        <Text style={[ style.sheet.form.input, style.sheet.form.text ]}>Choose your password:</Text>
                        <Text style={[ style.sheet.form.input, style.sheet.form.description ]}>You can skip having a password by using one of our other login options, such as Apple or Google login!</Text>

                        <Input style={style.sheet.form.input} placeholder="Password" secure/>
                    </View>
                </ScrollView>

                <View style={style.sheet.form}>
                    <Button style={style.sheet.form.input} title="Finish registration" branded/>
                    <Button style={style.sheet.form.input} title="Cancel" onPress={() => this.props?.onClose()}/>
                </View>
            </View>
        );
    }
};
