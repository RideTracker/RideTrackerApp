import React, { Component } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity } from "react-native";

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
            API.get("/api/profile/activities", { user: this.user }).then((data) => {
                this.setState({ activities: data.content });
            });
        }
    };

    async onLogoutPress() {
        await User.logout();

        this.props.onNavigate("/login");
    };

    render() { 
        if(!this.user)
            return (<LoginPage onNavigate={(page) => this.props?.onNavigate(page)}/>);

        return (
            <View style={style.sheet}>
                { (this.user == User.id) ?
                    (<Header
                        transparent
                        button="sign-out-alt"
                        onButtonPress={() => this.onLogoutPress()}
                        />)
                    :
                    (<Header
                        title="Profile"
                        />)
                }

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

                    <View style={style.sheet.tabs}>
                        <TouchableOpacity style={[ style.sheet.tabs.tab, style.sheet.tabs.tab.active ]}>
                            <Text style={style.sheet.tabs.tab.text}>Activities</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={style.sheet.tabs.tab}>
                            <Text style={style.sheet.tabs.tab.text}>Bikes</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {this.state?.activities && this.state.activities.map((id) => 
                            (<ActivityCompact id={id} key={id} showAuthor={false} onPress={(id) => this.setState({ activity: id })}/>)
                        )}
                    </ScrollView>
                </ScrollView>
                
                <Footer onNavigate={(path) => this.props.onNavigate(path)}/>

                {this.state?.showActivity && (
                    <Activity id={this.state.showActivity} onClose={() => this.setState({ activity: null })}/>
                )}
            </View>
        );
    }
};
