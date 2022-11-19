import { Component } from "react";
import { View } from "react-native";

import Input from "app/Components/Input.component";

import Error from "./Modal/Error";

export default class Modal extends Component {
    render() {
        return (
            <View style={{
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%"
            }}>
                {this.props.children}
            </View>
        );
    };

    static Error = Error;
};
