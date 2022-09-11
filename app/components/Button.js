import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#303030",

        margin: 12,
        padding: 12,

        borderRadius: 5,

        text: {
            color: "#FFF",

            fontWeight: "bold",
            fontSize: 18,

            textAlign: "center"
        }
    }
});

export default class Button extends React.Component {
    render() { 
        return (
            <TouchableOpacity style={styles.button} onPress={() => this.props.onPress()}>
                <Text style={styles.button.text}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
};
