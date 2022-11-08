import { Component } from "react";
import { View, ScrollView } from "react-native";

import User from "app/Data/User";

import Button from "app/Components/Button.component";
import Header from "app/Components/Layouts/Header.component";

import style from "./Settings.component.style";

export default class ProfileSetings extends Component {
    style = style.update();

    async onLogoutPress() {
        await User.logout();

        this.props.onNavigate("/index");
        this.props.showModal("LoginPage");
        this.props.onClose();
    };

    render() {
        return (
            <View style={style.sheet}>
                <Header
                    title="Settings"

                    navigation={(this.props?.onClose)}
                    onNavigationPress={() => this.props?.onClose()}
                    />

                <ScrollView>
                    <Button title={"Logout"} confirm onPress={() => this.onLogoutPress()}/>
                </ScrollView>
            </View>
        );
    };
};
