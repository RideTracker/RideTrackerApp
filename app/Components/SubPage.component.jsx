import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";

import Animation from "app/Animation";

import style from "./SubPage.component.style";

export default class SubPage extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.animation = React.createRef();
    };

    onClose() {
        this.animation.current.setTransitions([
            {
                type: "bottom",
                direction: "out",
                duration: 200,
                callback: () => this.props.onClose()
            },

            {
                type: "opacity",
                direction: "out",
                duration: 200
            }
        ]);
    };

    render() {
        return (
            <Animation
                ref={this.animation}
                enabled={true}
                style={style.sheet}
                transitions={[
                    {
                        type: "bottom",
                        duration: 200
                    },
                    
                    {
                        type: "opacity",
                        duration: 200
                    }
                ]}
                >
                <TouchableOpacity style={style.sheet.overlay} onPress={() => this.onClose()}/>

                <View style={style.sheet.content}>
                    {this.props.children}
                </View>
            </Animation>
        );
    };
};
