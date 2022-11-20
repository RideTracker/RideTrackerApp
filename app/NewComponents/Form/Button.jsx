import React, { Component } from "react";
import { TouchableOpacity, Text, Alert } from "react-native";

import Appearance from "app/Data/Appearance";

export default class Button extends Component {
    onPress() {
        if(this.props.confirm != undefined) {
            Alert.alert(
                this.props.confirm.title ?? "Are you sure?",
                this.props.confirm.message ?? "Do you really want to perform this action?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: () => this.props.onPress() }
                ]
            );

            return;
        }
        
        this.props.onPress();
    };

    render() { 
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: Appearance.theme.colorPalette.accent,

                    justifyContent: "center",
                    height: 44,

                    borderRadius: 5,

                    backgroundColor: (this.props?.branded)?(Appearance.theme.colorPalette.route):(
                        (this.props?.transparent || this.props?.confirm)?("transparent"):(
                            (this.props?.opaque)?("rgba(0, 0, 0, .2)"):(
                                Appearance.theme.colorPalette.accent
                            )
                        )
                    ),
                    
                    ...this.props?.style
                }}
                onPress={() => this.onPress()}
                >
                <Text
                    style={{
                        fontSize: 18,

                        textAlign: "center",

                        color: (this.props?.confirm)?("#850000"):(Appearance.theme.colorPalette.secondary)
                    }}
                    >
                        {this.props.title}
                    </Text>
            </TouchableOpacity>
        );
    }
};
