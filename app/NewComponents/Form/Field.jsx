import { Component } from "react";
import { View } from "react-native";

export default class Field extends Component {
    render() {
        return (
            <View style={{
                marginVertical: 6
            }}>
                {this.props.children}
            </View>
        );
    };
};
