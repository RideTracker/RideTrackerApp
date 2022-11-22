import React, { Component } from "react";
import { ScrollView, RefreshControl } from "react-native";

import Appearance from "app/Data/Appearance";
import Config from "app/Data/Config";

import { Page, Modal } from "app/Components";
import { Activity } from "app/Layouts";

import API from "app/Services/API";

import Filter from "./Home/Filter";

export default class Home extends Component {
    static Filter = Filter;

    componentDidMount() {
        this.onRefresh();
    };

    showActivity(id) {
        this.props.showModal("Activity", { id });
    };

    hideModal(modal) {
        this.props.hideModal(modal);
    };

    onRefresh() {
        this.setState({ refreshing: true });

        API.post("/api/v1/feed", { filter: Config?.user?.filter }).then((result) => {
            if(result.error) {
                this.setState({
                    refreshing: false,
                    error: true
                });

                return;
            }

            this.setState({
                activities: result.content,
                refreshing: false,
                error: false
            });
        });
    };

    render() { 
        return (
            <Page>
                <Page.Header
                    title="Home"

                    button={"filter"}
                    onButtonPress={() => this.props.showModal("FilterPage", { onUpdate: () => this.onRefresh() })}
                    />

                {(this.state?.error)?(
                    <Modal.Error description={"We couldn't connect to the server, please try again later!"}/>
                ):(
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                tintColor={Appearance.theme.colorPalette.solid}
                                refreshing={this.state?.refreshing}
                                onRefresh={() => this.onRefresh()}
                                />
                            }
                        >
                        
                        {(this.state?.activities) && this.state?.activities.map(id => <Activity.Compact key={id} id={id} onPress={(id) => this.showActivity(id)}/>)}
                    </ScrollView>
                )}
            </Page>
        );
    }
};
