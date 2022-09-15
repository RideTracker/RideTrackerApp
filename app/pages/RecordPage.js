import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, Text, View, Image, ScrollView, TouchableOpacityBase } from 'react-native';
import Constants from 'expo-constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { WebView } from 'react-native-webview';

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Activity from "../components/Activity";
import Button from "../components/Button";
import API from "../API";

import Config from "../config.json";
import RideRecorder from "../data/RideRecorder";

const styles = StyleSheet.create({
    page: {
        backgroundColor: Config.colorPalette.section,

        height: "100%",

        paddingBottom: 20,

        stats: {
            flex: 1,

            justifyContent: "space-evenly",

            row: {
                flexDirection: "row",
                justifyContent: "space-evenly"
            },

            container: {
                position: "relative"
            },
            
            item: {
                title: {
                    color: Config.colorPalette.highlight,
                    
                    fontSize: 46,
                    fontWeight: "bold",
                    textAlign: "center"
                },
    
                description: {
                    color: Config.colorPalette.foreground,
                    
                    fontSize: 26,
                    textAlign: "center"
                }
            },
    
            wide: {
                title: {
                    fontSize: 80
                },

                text: {
                    color: Config.colorPalette.foreground,

                    fontSize: 26,
                    fontWeight: "normal",
                    textAlign: "center",

                    hidden: {
                        color: "transparent"
                    }
                }
            },
    
            high: {
                title: {
                    fontSize: 100
                }
            }
        },

        controls: {
            padding: 32,

            flexDirection: "row",

            justifyContent: "space-evenly",

            container: {
                flexDirection: "row"
            },  

            button: {
                position: "relative",

                marginLeft: 12,
                marginRight: 12,

                icon: {
                    color: Config.colorPalette.foreground,
                    
                    fontSize: 70,
                },
                
                container: {
                    position: "absolute",

                    top: 0,
                    bottom: 0, 

                    left: 0,
                    right: 0,
                    
                    justifyContent: "center",
                    alignItems: "center"
                },
                
                text: {
                    color: Config.colorPalette.foreground,
                    
                    fontSize: 14,
                    fontWeight: "bold"
                }
            }
        }
    }
});

export default class RecordPage extends React.Component {
    recorder = new RideRecorder(true);

    componentDidMount() {
        this.interval = setInterval(() => this.onInterval(), 1000);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onInterval() {
        if(!this.recorder.active)
            return;

        this.setState({
            duration: this.recorder.getDuration(),
            speed: Math.round(this.recorder.getSpeed() * 10) / 10
        });
    };

    onPositionUpdate(position) {
        console.log(position);
    };

    togglePause() {
        this.recorder.toggle();

        this.setState({});
    };

    async onFinish() {
        console.log("finish");

        if(this.recorder.active)
            this.recorder.stop();

        const result = await this.recorder.save();

        Alert.alert(this.recorder.id + ".json", result);
    };

    onDiscard() {
        if(this.recorder.active)
            this.recorder.stop();

        this.props.onPageNavigation("home");
    };

    renderStateDuration() {
        let duration = (this.state?.duration || 0) / 1000;

        let result = [];

        let hours = Math.floor(duration / 60 / 60);
        duration -= hours * 60 * 60;
        result.push((hours < 10 && "0") + hours);

        let minutes = Math.floor(duration / 60);
        duration -= minutes * 60;
        result.push((minutes < 10 && "0") + minutes);

        duration = Math.floor(duration);
        result.push((duration < 10 && "0") + duration);

        return result.join(':');
    };

    renderStats() {
        if(!this.recorder.active) {
            return (
                <View style={styles.page.stats}>
                    <View style={styles.page.stats.row}>
                        <View style={[styles.page.stats.item, styles.page.stats.wide]}>
                            <Text style={[styles.page.stats.item.title, styles.page.stats.wide.title]}>{this.renderStateDuration()}</Text>
                            <Text style={styles.page.stats.item.description}>duration</Text>
                        </View>

                        <View style={[styles.page.stats.item, styles.page.stats.wide]}>
                            <Text style={[styles.page.stats.item.title, styles.page.stats.wide.title]}>{this.state?.speed ?? 0} km/h</Text>
                            <Text style={styles.page.stats.item.description}>speed</Text>
                        </View>
                    </View>

                    <View style={styles.page.stats.row}>
                        <View style={styles.page.stats.item}>
                            <Text style={styles.page.stats.item.title}>0.00 km</Text>
                            <Text style={styles.page.stats.item.description}>distance</Text>
                        </View>

                        <View style={styles.page.stats.item}>
                            <Text style={styles.page.stats.item.title}>0 m</Text>
                            <Text style={styles.page.stats.item.description}>elevation</Text>
                        </View>
                    </View>
                </View>
            );
        }
        
        return (
            <View style={styles.page.stats}>
                <View style={[styles.page.stats.item, styles.page.stats.wide]}>
                    <Text style={[styles.page.stats.item.title, styles.page.stats.wide.title]}>{this.renderStateDuration()}</Text>

                    <Text style={styles.page.stats.item.description}>duration</Text>
                </View>

                <View style={[styles.page.stats.item, styles.page.stats.wide]}>
                    <View style={styles.page.stats.item.container}>
                        <Text style={[styles.page.stats.item.title, styles.page.stats.high.title]}>
                            <Text style={[styles.page.stats.wide.text, styles.page.stats.wide.text.hidden]}> km/h</Text>

                            {this.state?.speed ?? 0}
                            
                            <Text style={styles.page.stats.wide.text}> km/h</Text>
                        </Text>
                    </View>
                </View>
                        
                <View style={styles.page.stats.row}>
                    <View style={styles.page.stats.item}>
                        <Text style={styles.page.stats.item.title}>0.00 km</Text>
                        <Text style={styles.page.stats.item.description}>distance</Text>
                    </View>
                
                    <View style={styles.page.stats.item}>
                        <Text style={styles.page.stats.item.title}>0 m</Text>
                        <Text style={styles.page.stats.item.description}>elevation</Text>
                    </View>
                </View>
            </View>
        );
    };

    render() { 
        return (
            <View style={styles.page}>
                {!this.recorder.active &&
                    [
                        (<Header key="1" title="Paused"/>),
                        
                        (<WebView key="2" source={{
                            uri: API.server + "/map.html"
                        }} scrollEnabled="false"/>)
                    ]
                }

                <View style={styles.page.stats}>
                    {this.renderStats()}
                </View>

                <View style={styles.page.controls}>
                    <TouchableOpacity style={styles.page.controls.button} onPress={() => this.togglePause()}>
                        <FontAwesome5 style={styles.page.controls.button.icon} name={(!this.recorder.active)?("play-circle"):("stop-circle")} solid/>
                    </TouchableOpacity>
                </View>

                { !this.recorder.active &&
                    <View>
                        <Button title="Finish" onPress={() => this.onFinish()}/>
                        <Button title="Discard" confirm={{
                            message: "Do you really want to discard this ride?"
                        }} onPress={() => this.onDiscard()}/>
                    </View>
                }
            </View>
        );
    }
};
