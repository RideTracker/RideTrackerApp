import { Component } from "react";
import { View, ScrollView } from "react-native";

import User from "app/Data/User";

import { Page, Form } from "app/Components";

import style from "./Settings.component.style";

export default class ProfileSetings extends Component {
    style = style.update();

    async onLogoutPress() {
        await User.logout();

        this.props.onNavigate("/index");
        this.props.showModal("LoginPage");
        this.props.onClose();
    };

    async onDeletePress() {
        await API.delete("/api/v1/user");
        
        await this.onLogoutPress();
    };

    render() {
        return (
            <View style={style.sheet}>
                <Page.Header
                    title="Settings"

                    navigation={(this.props?.onClose)}
                    onNavigationPress={() => this.props?.onClose()}
                    />

                <ScrollView>
                    <Form.Button title={"Logout"} confirm onPress={() => this.onLogoutPress()}/>
                    <Form.Button title={"Delete my account"} confirm={{
                        title: "Delete my account",
                        message: "Are you sure? Your personal data will be deleted within a week and your account cannot be recovered!\n\nWarning! Your activities will not be deleted, you must delete those manually before you delete your account!"
                    }} onPress={() => this.onDeletePress()}/>
                </ScrollView>
            </View>
        );
    };
};
