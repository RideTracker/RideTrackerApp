import React, { Component } from "react";
import { View } from "react-native";

import Animation from "app/Components/Animation.component";
import Header from "app/Components/Layouts/Header.component";

import style from "./Bike.style";

export default class Bike extends Component {
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
                <Header
                    title="Bike"
                    navigation="true"
                    onNavigationPress={() => this.onClose()}
                    />
            </Animation>
        );
    };
};
