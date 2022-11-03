import { Component } from "react";
import { View } from "react-native";

import Header from "app/Components/Layouts/Header.component";

import style from "./Settings.component.style";

export default class ProfileSetings extends Component {
    style = style.update();

    render() {
        return (
            <View style={style.sheet}>
                <Header
                    title="Settings"

                    navigation={(this.props?.onClose)}
                    onNavigationPress={() => this.props?.onClose()}
                    />
            </View>
        );
    };
};
