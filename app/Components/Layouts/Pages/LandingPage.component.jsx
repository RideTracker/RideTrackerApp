import React from "react";
import { View, ScrollView, RefreshControl, Text } from "react-native";

import Appearance from "app/Data/Appearance";
import Config from "app/Data/Config";

import ThemedComponent from "app/Components/ThemedComponent";
import Header from "app/Components/Layouts/Header.component";
import ActivityCompact from "app/Components/ActivityCompact.component";
import Error from "app/Components/Error.component";

import API from "app/Services/API";

import style from "./LandingPage.component.style";

export default class LandingPage extends ThemedComponent {
    style = style.update();

    componentDidMount() {
        this.onRefresh();

        //Files.uploadFiles();
    };

    showActivity(id) {
        this.props.showModal("Activity", { id, style: style.sheet.container.page });
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
            <View style={style.sheet.container}>
                <View style={style.sheet.content}>
                    <Header
                        title="Home"

                        button={"filter"}
                        onButtonPress={() => this.props.showModal("FilterPage", { onUpdate: () => this.onRefresh() })}
                        />

                    {(this.state?.error)?(
                        <Error color={Appearance.theme.colorPalette.secondary} description={"We couldn't connect to the server, please try again later!"}/>
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
                            
                            {(this.state?.activities) && this.state?.activities.map(id => <ActivityCompact key={id} style={style.sheet.container.activity} id={id} onPress={(id) => this.showActivity(id)}/>)}
                        </ScrollView>
                    )}
                </View>
            </View>
        );
    }
};
