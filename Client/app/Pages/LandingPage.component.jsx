import React, { Component } from "react";
import { View, ScrollView } from "react-native";

import ThemedComponent from "../Components/ThemedComponent";
import Header from "../Layouts/Header.component";
import Footer from "../Layouts/Footer.component";
import Activity from "../Components/Activity.component";
import API from "../API";
import Files from "../Data/Files";

import style from "./LandingPage.component.style";

export default class LandingPage extends ThemedComponent {
    style = style.update();

    componentDidMount() {
        API.get("/api/feed/activities").then((result) => {
            this.setState({
                activities: result.content
            });
        });

        Files.uploadFiles();
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
            <View style={style.sheet.container}>
                <View style={style.sheet.content}>
                    <Header title="Home"/>

                    <ScrollView>
                        {this.state?.activities.map(id => <Activity key={id} style={style.sheet.container.activity} id={id} onPress={(id) => this.showActivity(id)}/>)}
                    </ScrollView>

                    <Footer onPress={(page) => this.props.onPageNavigation(page)}/>
                </View>

                {this.state != null && this.state.activity != null &&
                    <View style={style.sheet.container.page}>
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
