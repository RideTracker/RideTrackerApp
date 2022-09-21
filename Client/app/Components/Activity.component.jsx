import React, { Component } from "react";
import { Text, View, Image } from 'react-native';
import moment from "moment";

import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import ThemedComponent from "./ThemedComponent";

import API from "../API";
import Recording from "../Data/Recording";
import Cache from "../Data/Cache";

import Appearance from "../Data/Appearance";

import Button from "./Button.component";
import style from "./Activity.component.style";

export default class Activity extends ThemedComponent {
    style = style.update();

    ready = false;
    data = {};

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
    }

    componentDidMount() {
        Cache.getActivity(this.props.id).then((activity) => {
            this.setState({ activity });

            Cache.getUser(activity.user).then((user) => {
                this.setState({ user });
            });
        });

        Cache.getActivityRide(this.props.id).then((ride) => {
            this.setState({ recording: new Recording(ride) });
        });
    };

    onLayout() {
        this.mapView.current.fitToCoordinates(this.state.recording.getAllLatLngCoordinates(), {
            edgePadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            animated: false
        });
    };

    render() {
        if(this.state?.recording == null || this.state?.user == null) {
            // add a placeholder layout
            return null;
        }

        return (
            <View style={style.sheet}>
                <MapView ref={this.mapView} style={style.sheet.map} customMapStyle={Appearance.theme.mapStyle || []} provider={PROVIDER_GOOGLE} onLayout={() => this.onLayout()}>
                    {this.state.recording != null && 
                        (this.state.recording.getLatLngCoordinates().map(section => (
                            <Polyline key={section.index} coordinates={section.coordinates} 
                                strokeColor={Appearance.theme.colorPalette.secondary}
                                strokeWidth={3}
                                lineJoin={"round"}
                            ></Polyline>
                        )))
                    }
                </MapView>

                <View style={style.sheet.user}>
                    <View>
                        <Image
                            style={style.sheet.user.image}
                            source={{
                                uri: `https://ride-tracker.nora-soderlund.se/users/${this.state.user.slug}/avatar.png`
                            }}
                        />
                    </View>

                    <View style={style.sheet.user.texts}>
                        <Text style={style.sheet.user.texts.title}>{this.state.user.name}</Text>
                        <Text style={style.sheet.user.texts.description}>{moment(this.state.activity.timestamp).fromNow()} in Vänersborg</Text>
                    </View>
                </View>

                <View style={style.sheet.stats}>
                    <View style={style.sheet.stats.item}>
                        <Text style={style.sheet.stats.item.title}>{this.state.recording.getDistance()} km</Text>
                        <Text style={style.sheet.stats.item.description}>distance</Text>
                    </View>

                    <View style={style.sheet.stats.item}>
                        <Text style={style.sheet.stats.item.title}>{this.state.recording.getAverageSpeed()} km/h</Text>
                        <Text style={style.sheet.stats.item.description}>average speed</Text>
                    </View>
                    
                    <View style={style.sheet.stats.item}>
                        <Text style={style.sheet.stats.item.title}>{this.state.recording.getElevation()} m</Text>
                        <Text style={style.sheet.stats.item.description}>elevation</Text>
                    </View>
                    
                    <View style={style.sheet.stats.item}>
                        <Text style={style.sheet.stats.item.title}>{this.state.recording.getMaxSpeed()} km/h</Text>
                        <Text style={style.sheet.stats.item.description}>max speed</Text>
                    </View>
                </View>
                
                { this.props.onPress != undefined &&
                    <Button title="Show more details" onPress={() => this.props.onPress(this.state.activity.id)}/>
                }
            </View>
        );
    }
};
