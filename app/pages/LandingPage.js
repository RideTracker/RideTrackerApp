import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import Activity from "../components/Activity";
import API from "../API";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E1E"
    }
});

export default class LandingPage extends React.Component {
    activities = [];
    
    componentDidMount() {
        API.get("feed/activities").then((result) => {
            this.activities = result.content;

            this.setState({});
        });
    };

    render() { 
        return (
            <ScrollView style={styles.container}>
                {this.activities.map(activity => <Activity id={activity}/>)}
            </ScrollView>
        );
    }
};
