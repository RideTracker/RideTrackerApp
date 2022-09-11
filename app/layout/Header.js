import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Activity from "../components/Activity";
import API from "../API";

import Config from "../config.json";

const styles = StyleSheet.create({
    header: {
        width: "100%",

        position: "relative",

        backgroundColor: Config.colorPalette.section,

        paddingTop: Constants.statusBarHeight,
        
        borderBottomWidth: 1,
        borderBottomColor: Config.colorPalette.border,

        feed: {
            color: "#FFF",

            fontWeight: "bold",
            fontSize: 26,

            padding: 12,

            textAlign: "center"
        },

        button: {
            position: "absolute",

            top: Constants.statusBarHeight,

            bottom: 0,
            
            justifyContent: "center",

            icon: {
                color: Config.colorPalette.foreground,
                
                fontSize: 26,
                
                marginLeft: 24,
                marginRight: 24
            }
        },

        navigation: {
            right: 0
        }
    }
});

export default class Header extends React.Component {
    render() { 
        return (
            <View style={styles.header}>
                <Text style={styles.header.feed}>{this.props.title}</Text>

                {this.props.navigation != undefined &&
                    <TouchableOpacity style={[ styles.header.button, styles.header.navigation ]} onPress={this.props.onNavigationPress}>
                        <FontAwesome5 style={styles.header.button.icon} name={"times"}/>
                    </TouchableOpacity>
                }
            </View>
        );
    }
};
