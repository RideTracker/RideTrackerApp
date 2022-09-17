import React, { Component } from "react";
import { View, ScrollView } from "react-native";

import Header from "../Layouts/Header.component";
import Footer from "../Layouts/Footer.component";
import Activity from "../Components/Activity.component";
import API from "../API";

import style from "./LandingPage.component.style";

export default class LandingPage extends Component {
    componentDidMount() {
        API.get("feed/activities").then((result) => {
            this.setState({
                activities: result.content
            });
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
            <View style={style.container}>
                <View style={style.content}>
                    <Header title="Home"/>

                    <ScrollView>
                        {this.state?.activities.map(id => <Activity key={id} style={style.container.activity} id={id} onPress={(id) => this.showActivity(id)}/>)}
                    </ScrollView>

                    <Footer onPress={(page) => this.props.onPageNavigation(page)}/>
                </View>

                {this.state != null && this.state.activity != null &&
                    <View style={style.container.page}>
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
