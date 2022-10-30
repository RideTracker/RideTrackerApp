import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image, RefreshControl } from "react-native";
import WebView from "react-native-webview";

import * as NavigationBar from "expo-navigation-bar";

import moment from "moment";

import config from "app/../config.json";

import API from "app/Services/API";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

import Animation from "app/Components/Animation.component";

import style from "./Playback.style";

export default class ActivityPlayback extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);
        
        this.animation = React.createRef();
        this.webView = React.createRef();
    };

    componentDidMount() {
        Cache.getActivityRide(this.props.activity).then((ride) => {
            this.setState({
                recording: new Recording(ride),
                ready: true
            });
        });
    };

    onClose() {
        this.animation.current.setTransitions([
            {
                type: "bottom",
                direction: "out",
                duration: 200,
                callback: () => this.props?.onClose()
            }
        ]);
    };

    onLoad() {
        this.animation.current.setTransitions([
            {
                type: "bottom",
                duration: 200,
                ease: true
            }
        ]);

    };

    onMessage(event) {
        const content = JSON.parse(event.nativeEvent.data);

        this.setState({
            frame: content
        });
    };

    render() {
        if(this.state?.recording == null)
            return null;

        return (
            <Animation
                ref={this.animation}
                enabled={this.state?.ready}
                style={style.sheet}
                >

                <WebView
                    ref={this.webView}
                    style={style.sheet.map}
                    onLoad={() => this.onLoad()}
                    onMessage={(event) => this.onMessage(event)}
                    source={{
                        uri: `${config.api}/playback/index.html?activity=${this.props.activity}&color=${Appearance.theme.colorPalette.route.replace('#', '')}&background=${Appearance.theme.colorPalette.background.replace('#', '')}`
                    }}
                    />

                {this.state?.frame && (
                    <View style={style.sheet.overlay}>
                        <View style={style.sheet.overlay.stats}>
                            <View style={style.sheet.overlay.stats.item}>
                                <Text style={style.sheet.overlay.stats.item.title}>{this.state.recording.getSectionCoordinateSpeed(this.state.frame.section, this.state.frame.coordinate)}
                                    <Text style={style.sheet.overlay.stats.item.unit}> km/h</Text>
                                </Text>
                                <Text style={style.sheet.overlay.stats.item.description}>speed</Text>
                            </View>
                            
                            <View style={style.sheet.overlay.stats.item}>
                                <Text style={style.sheet.overlay.stats.item.title}>{this.state.recording.getSectionCoordinateDistance(this.state.frame.section, this.state.frame.coordinate)}
                                    <Text style={style.sheet.overlay.stats.item.unit}> km</Text>
                                </Text>
                                <Text style={style.sheet.overlay.stats.item.description}>distance</Text>
                            </View>
                        </View>
                    </View>
                )}

            </Animation>
        );
    };
};
