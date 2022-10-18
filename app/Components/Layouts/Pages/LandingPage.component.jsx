import React, { Component } from "react";
import { View, ScrollView, RefreshControl } from "react-native";

import Appearance from "app/Data/Appearance";

import ThemedComponent from "app/Components/ThemedComponent";
import Animation from "app/Components/Animation.component";
import Header from "app/Components/Layouts/Header.component";
import Footer from "app/Components/Layouts/Footer.component";
import Activity from "app/Components/Activity.component";
import ActivityCompact from "app/Components/ActivityCompact.component";
import API from "app/API";
import Files from "app/Data/Files";

import style from "./LandingPage.component.style";

export default class LandingPage extends ThemedComponent {
    style = style.update();

    componentDidMount() {
        API.get("/api/feed").then((result) => {
            console.log(result.content);
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

    onRefresh() {
        this.setState({ refreshing: true });

        API.get("/api/feed").then((result) => {
            this.setState({
                activities: result.content,
                refreshing: false
            });
        });
    };

    render() { 
        return (
            <View style={style.sheet.container}>
                <View style={style.sheet.content}>
                    <Header title="Home"/>

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                tintColor={Appearance.theme.colorPalette.solid}
                                refreshing={this.state?.refreshing}
                                onRefresh={() => this.onRefresh()}
                                />
                            }
                        >
                        
                        {this.state?.activities && this.state?.activities.map(id => <ActivityCompact key={id} style={style.sheet.container.activity} id={id} onPress={(id) => this.showActivity(id)}/>)}
                    </ScrollView>

                    <Footer onNavigate={(path) => this.props.onNavigate(path)}/>
                </View>

                {this.state != null && this.state.activity != null &&
                    <Animation slide={200} style={style.sheet.container.page}>
                        <Activity id={this.state.activity} onClose={() => this.hideActivity()}/>
                    </Animation>
                }
            </View>
        );
    }
};
