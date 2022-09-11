import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Activity from "../components/Activity";
import API from "../API";

import Config from "../config.json";

const styles = StyleSheet.create({
    footer: {
        height: 70,
        width: "100%",

        backgroundColor: Config.colorPalette.section,
        
        borderTopWidth: 1,
        borderTopColor: Config.colorPalette.border,

        container: {
            flex: 1,
            flexDirection: "row",

            button: {
                height: 60,

                flex: 1,
                alignItems: "center",
                justifyContent: "center",

                icon: {
                    color: "#F1F1F1",
        
                    fontSize: 20,            
                },

                text: {
                    color: "#FFF",

                    marginTop: 4,
        
                    fontSize: 14,
        
                    textAlign: "center"
                }
            }
        }
    }
});

export default class Footer extends React.Component {
    render() { 
        return (
            <View style={styles.footer}>
                <View style={styles.footer.container}>
                    <TouchableOpacity style={styles.footer.container.button}>
                        <FontAwesome5 style={styles.footer.container.button.icon} name={"home"}/>

                        <Text style={styles.footer.container.button.text}>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.footer.container.button}>
                        <FontAwesome5 style={styles.footer.container.button.icon} name={"circle"} solid/>

                        <Text style={styles.footer.container.button.text}>Record</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.footer.container.button}>
                        <FontAwesome5 style={styles.footer.container.button.icon} name={"user"} solid/>

                        <Text style={styles.footer.container.button.text}>Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};
