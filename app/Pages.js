import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import RecordPage from "./pages/RecordPage";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Activity from "./components/Activity";
import API from "./API";

import Config from "./config.json";

const styles = StyleSheet.create({
    pages: {
        height: "100%"
    }
});

export default class Pages extends React.Component {
    setPage(page) {
        this.setState({
            page: page
        });
    };

    getPage() {
        if(this.state == null || this.state.page == "home")
            return (<LandingPage onPageNavigation={(page) => this.setPage(page)}/>);
        
        if(this.state.page == "profile")
            return (<ProfilePage onPageNavigation={(page) => this.setPage(page)}/>);
        
        if(this.state.page == "record")
            return (<RecordPage onPageNavigation={(page) => this.setPage(page)}/>);
    }

    render() { 
        return (
            <View style={styles.pages}>
                {this.getPage()}
            </View>
        );
    }
};
