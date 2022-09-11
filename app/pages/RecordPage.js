import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image, ScrollView, TouchableOpacityBase } from 'react-native';
import Constants from 'expo-constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Activity from "../components/Activity";
import Button from "../components/Button";
import API from "../API";

import Config from "../config.json";

const styles = StyleSheet.create({
    page: {
        backgroundColor: Config.colorPalette.section,

        height: "100%",

        paddingBottom: 20,

        paused: {
        }, 

        stats: {
            flex: 1,

            justifyContent: "space-evenly",

            row: {
                flexDirection: "row",
                justifyContent: "space-evenly"
            },
            
            small: {
                title: {
                    color: Config.colorPalette.highlight,
                    
                    fontSize: 36,
                    fontWeight: "bold",
                    textAlign: "center"
                },
    
                description: {
                    color: Config.colorPalette.foreground,
                    
                    fontSize: 16,
                    textAlign: "center"
                }
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
    
            big: {
                title: {
                    color: Config.colorPalette.highlight,
                    
                    fontSize: 66,
                    fontWeight: "bold",
                    textAlign: "center"
                },
    
                description: {
                    color: Config.colorPalette.foreground,
                    
                    fontSize: 26,
                    textAlign: "center"
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
    componentDidMount() {
        Location.requestForegroundPermissionsAsync().then(result => {
            this.setState({
                paused: true,
                seconds: 0
            });
    
            this.interval = setInterval(() => this.onInterval(), 1000);

            this.watcher = Location.watchPositionAsync({
                showsBackgroundLocationIndicator: true
            }, (...args) => this.onPositionUpdate(...args));
        });
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onInterval() {
        if(this.state.paused)
            return;

        this.setState({
            seconds: this.state.seconds + 1
        });
    };

    onPositionUpdate(position) {
        console.log(position);
    };

    togglePause() {
        this.setState({
            paused: !this.state?.paused
        });
    };

    onFinish() {

    };

    onDiscard() {
        this.props.onPageNavigation("home");
    };

    renderStats() {
        if(this.state?.paused == true) {
            return (
                <View style={[ styles.page.stats, styles.page.paused ]}>
                    <View style={styles.page.stats.row}>
                        <View style={styles.page.stats.small}>
                            <Text style={styles.page.stats.small.title}>{this.state.seconds}</Text>
                            <Text style={styles.page.stats.small.description}>duration</Text>
                        </View>
                        
                        <View style={styles.page.stats.small}>
                            <Text style={styles.page.stats.small.title}>0.00 km/h</Text>
                            <Text style={styles.page.stats.small.description}>average speed</Text>
                        </View>
                    </View>

                    <View style={styles.page.stats.row}>
                        <View style={styles.page.stats.small}>
                            <Text style={styles.page.stats.small.title}>0.00 km</Text>
                            <Text style={styles.page.stats.small.description}>distance</Text>
                        </View>

                        <View style={styles.page.stats.small}>
                            <Text style={styles.page.stats.small.title}>0 m</Text>
                            <Text style={styles.page.stats.small.description}>elevation</Text>
                        </View>
                    </View>
                </View>
            );
        }
        
        return (
            <View style={styles.page.stats}>
                <View style={styles.page.stats.item}>
                    <Text style={styles.page.stats.item.title}>{this.state?.seconds}</Text>

                    <Text style={styles.page.stats.item.description}>duration</Text>
                </View>
                
                <View style={styles.page.stats.big}>
                    <Text style={styles.page.stats.big.title}>0.00 km/h</Text>
                    <Text style={styles.page.stats.big.description}>average speed</Text>
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
                {this.state?.paused == true &&
                    [
                        (<Header title="Paused"/>),
                        
                        (<WebView source={{
                            uri: API.server + "/map.html"
                        }} scrollEnabled="false"/>)
                    ]
                }

                <View style={styles.page.stats}>
                    {this.renderStats()}
                </View>

                <View style={styles.page.controls}>
                    <TouchableOpacity style={styles.page.controls.button} onPress={() => this.togglePause()}>
                        <FontAwesome5 style={styles.page.controls.button.icon} name={(this.state?.paused)?("play-circle"):("stop-circle")} solid/>
                    </TouchableOpacity>

                    {/* this.state?.paused == true &&
                        <TouchableOpacity style={styles.page.controls.button}>
                            <View style={styles.page.controls.button.container}>
                                <Text style={styles.page.controls.button.text}>FINISH</Text>
                            </View>
                            <FontAwesome5 style={styles.page.controls.button.icon} name={"circle"}/>
                        </TouchableOpacity>
                    */}
                </View>

                { this.state?.paused == true &&
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
