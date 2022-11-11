import { Component } from "react";
import { View } from "react-native";

import Input from "app/Components/Input.component";

import Title from "./Form/Title";
import Description from "./Form/Description";
import Field from "./Form/Field";
import Selection from "./Form/Selection";

export default class Form extends Component {
    render() {
        return (
            <View style={{
                marginVertical: 12
            }}>
                {this.props.children}
            </View>
        );
    };

    static Input = Input;
    static Field = Field;
    static Title = Title;
    static Description = Description;
    static Selection = Selection;
};
