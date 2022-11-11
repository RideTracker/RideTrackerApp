import { Component } from "react";
import { Text } from "react-native";

import Appearance from "app/Data/Appearance";

export default class Title extends Component {
    render() {
        return (
            <Text style={{
                marginVertical: 4,
    
                color: Appearance.theme.colorPalette.secondary,
    
                fontSize: 16,
                fontWeight: "bold"
            }}>
                {this.props.text}
            </Text>
        );
    };
};
