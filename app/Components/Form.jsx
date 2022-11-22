import { Component } from "react";
import { View } from "react-native";

import Title from "./Form/Title";
import Description from "./Form/Description";
import Field from "./Form/Field";
import Selection from "./Form/Selection";
import Button from "./Form/Button";
import Input from "./Form/Input";

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
    static Button = Button;
    static Selection = Selection;
    static Input = Input;
};
