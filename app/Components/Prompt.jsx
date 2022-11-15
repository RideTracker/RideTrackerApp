import React, { Component } from "react";
import { View, TouchableOpacity, Text, Image, Platform, Alert } from "react-native";

import * as Location from "expo-location";
import * as NavigationBar from "expo-navigation-bar";

import Header from "app/Components/Layouts/Header.component";
import Button from "app/Components/Button.component";

import Appearance from "app/Data/Appearance";

import Animation from "app/Components/Animation.component";

import style from "./Prompt.style";

export default class Prompt extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.animation = React.createRef();
    };

    componentDidMount() {
        if(Platform.OS == "android") {
            NavigationBar.setVisibilityAsync("hidden");
        }
    };

    componentWillUnmount() {
        if(Platform.OS == "android") {
            NavigationBar.setVisibilityAsync("visible");
        }
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

    async onAcceptPress() {
        try {
            const permissions = await Location.requestBackgroundPermissionsAsync();

            if(!permissions.granted)
                return Alert.alert("", "Background location access was not granted, try again or choose to continue without these features.");

            this.onClose();
        }
        catch {
            return Alert.alert("", "Something went wrong, try again or choose to continue without these features.");
        }
    };

    onContinuePress() {
        Alert.alert("", "If you decide to enable background location access in the future, you can do this through App Permissions under the Settings tab.", [
            {
                onPress: () => this.onClose()
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

                <Image
                    style={style.sheet.background}
                    source={require("root/assets/background.png")}
                    blurRadius={8}
                    />

                <View style={style.sheet.container}>
                    <View style={style.sheet.content}>
                        <Image
                            style={style.sheet.logo}
                            source={require("root/assets/ridetracker.png")}
                            />

                        <Text style={style.sheet.title}>Ride Tracker collects location data to enable activity recording and route planning even when the app is closed.</Text>
                    </View>

                    <View style={style.sheet.footer}>
                        <Button style={style.sheet.footer.button} branded title={"Enable background location access"} onPress={() => this.onAcceptPress()}/>
                        <Button style={style.sheet.footer.button} transparent title={"Continue without those features"} onPress={() => this.onContinuePress()}/>
                    </View>
                </View>
            </Animation>
        );
    };
};
