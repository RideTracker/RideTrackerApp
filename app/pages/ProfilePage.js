import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Activity from "../components/Activity";
import API from "../API";

import Config from "../config.json";

const styles = StyleSheet.create({
    page: {
        flex: 1,

        height: "100%"
    }
});

export default class ProfilePage extends React.Component {
    render() { 
        return (
            <View style={styles.page}>
                <Header title="Profile"/>

                <ScrollView></ScrollView>
                
                <Footer onPress={(page) => this.props.onPageNavigation(page)}/>
            </View>
        );
    }
};
