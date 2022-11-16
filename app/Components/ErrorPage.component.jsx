import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, ScrollView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import * as ImagePicker from "expo-image-picker";

import API from "app/Services/API";

import Header from "app/Components/Layouts/Header.component";
import Animation from "app/Components/Animation.component";
import Button from "app/Components/Button.component";

import style from "./ErrorPage.component.style";
import Error from "./Error.component";

export default class ErrorPage extends Component {
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
                <Error description={this.props.description}/>

                <View style={style.sheet.footer}>
                    <Button title="Close" onPress={() => this.onClose()}/>
                </View>
            </Animation>
        );
    };
};
