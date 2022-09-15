import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Activity from "../components/Activity";
import API from "../API";

import Config from "../config.json";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        position: "relative",

        page: {
            backgroundColor: Config.colorPalette.background,

            position: "absolute",

            width: "100%",
            height: "100%",

            left: 0,
            top: 0
        }
    },

    content: {
        height: "100%",

        activity: {
			marginTop: 50
		}
    }
});

export default class LandingPage extends React.Component {
    activities = [];
    
    componentDidMount() {
        API.get("feed/activities").then((result) => {
            //this.activities = result.content;

            this.setState({});
        });
    };

    showActivity(id) {
        this.setState({
            activity: id
        });
    };

    hideActivity() {
        this.setState({
            activity: null
        });
    };

    render() { 
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Header title="Home"/>

                    <ScrollView>
                        {this.activities.map(id => <Activity key={id} style={styles.container.activity} id={id} onPress={(id) => this.showActivity(id)}/>)}
                    </ScrollView>

                    <Footer onPress={(page) => this.props.onPageNavigation(page)}/>
                </View>

                {this.state != null && this.state.activity != null &&
                    <View style={styles.container.page}>
                        <Header title="Activity" navigation="true" onNavigationPress={() => this.hideActivity()}/>

                        <ScrollView>
                            <Activity id={this.state.activity}/>
                        </ScrollView>
                    </View>
                }
            </View>
        );
    }
};
