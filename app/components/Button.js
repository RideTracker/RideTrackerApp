import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image, Alert } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#303030",

        margin: 12,
        marginBottom: 6,
        marginTop: 6,
        padding: 12,

        borderRadius: 5,

        text: {
            color: "#FFF",

            fontWeight: "bold",
            fontSize: 18,

            textAlign: "center"
        }
    },

    confirm: {
        backgroundColor: "#850000"
    }
});

export default class Button extends React.Component {
    onPress() {
        if(this.props.confirm != undefined) {
            Alert.alert(
                this.props.confirm.title ?? "Are you sure?",
                this.props.confirm.message ?? "Do you really want to perform this action?",
                [
                    { text: "Yes", onPress: () => this.props.onPress() },
                    { text: "Cancel", style: "cancel" }
                ]
            );

            return;
        }
        
        this.props.onPress();
    };

    render() { 
        return (
            <TouchableOpacity style={[styles.button, (this.props.confirm != undefined && styles.confirm)]} onPress={() => this.onPress()}>
                <Text style={styles.button.text}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
};
