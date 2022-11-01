import React, { Component } from "react";
import { View, ScrollView, Image, Text, TouchableHighlightBase } from "react-native";

import API from "app/Services/API";

import User from "app/Data/User";

import Activity from "app/Components/Activity.component";
import ActivityCompact from "app/Components/ActivityCompact.component";

import Header from "app/Components/Layouts/Header.component";
import Footer from "app/Components/Layouts/Footer.component";

import style from "./ProfilePage.component.style";
import LoginPage from "./LoginPage.component";

export default class ProfilePage extends Component {
    style = style.update();

    componentDidMount() {
        this.user = (this.props.user)?(this.props.user):(User.id);

        if(this.user) {
            API.get("/api/profile/activity", { user: this.user }).then((data) => {
                this.setState({ activity: data.content });
            });
        }
    };

    async onLogoutPress() {
        await User.logout();

        this.props.onNavigate("/login");
    };

    render() { 
        if(!this.user)
            return (<LoginPage onNavigate={(page) => this.props?.onNavigate({ page })}/>);

        return (
            <View style={style.sheet}>
                <Header
                    title="Profile"
                    button="sign-out-alt"
                    onButtonPress={() => this.onLogoutPress()}
                    />

                <ScrollView>
                    <View style={[ style.sheet.profile.item, style.sheet.profile.avatar ]}>
                        <Image
                            style={style.sheet.profile.avatar.image}
                            source={{
                                uri: `https://ride-tracker.nora-soderlund.se/users/nora-soderlund/avatar.png`
                            }}
                        />
                    </View>

                    <Text style={[ style.sheet.profile.item, style.sheet.profile.title ]}>Nora Söderlund</Text>

                    <Text style={[ style.sheet.profile.item, style.sheet.profile.follow ]}>FOLLOW</Text>

                    <View style={style.sheet.section}>
                        <Text style={[ style.sheet.profile.item, style.sheet.section.title ]}>Latest Activity</Text>

                        {this.state?.activity && (
                            <ActivityCompact id={this.state.activity.latest} onPress={(id) => this.setState({ activity: id })}/>
                        )}
                    </View>
                </ScrollView>
                
                <Footer onNavigate={(path) => this.props.onNavigate(path)}/>

                {this.state?.showActivity && (
                    <Activity id={this.state.showActivity} onClose={() => this.setState({ activity: null })}/>
                )}
            </View>
        );
    }
};
