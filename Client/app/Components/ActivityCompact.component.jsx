import React, { Component } from "react";
import { Text, View, Image } from 'react-native';
import moment from "moment";

import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import ThemedComponent from "./ThemedComponent";

import API from "../API";
import Recording from "../Data/Recording";

import Appearance from "../Data/Appearance";

import Button from "./Button.component";
import style from "./ActivityCompact.component.style";

export default class ActivityCompact extends ThemedComponent {
    style = style.update();

    ready = false;
    data = {};

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
    }

    componentDidMount() {
        // pls do a API.get([])
        API.get("/api/activity", {
            id: this.props.id
        }).then((data) => {
            this.setState({
                data: data.content
            });

            API.get("/api/user", {
                id: this.state.data.user
            }).then((data) => {
                this.setState({
                    user: data.content,

                    ready: true
                });
            });
        });

        API.get("/rides/" + this.props.id + ".json").then(data => {
            this.setState({
                recording: new Recording(data)
            });
        });
    };

    onLayout() {        
        this.mapView.current.fitToCoordinates(this.state.recording.getAllLatLngCoordinates(), {
            edgePadding: {
                top: 0,
                right: 0,
                bottom: 60,
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
                <View style={style.sheet.map}>
                    <MapView ref={this.mapView} style={style.sheet.map.view} customMapStyle={Appearance.theme.mapStyleCompact || []} provider={PROVIDER_GOOGLE} onLayout={() => this.onLayout()}>
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

                    <View style={style.sheet.stats}>
                        <View style={style.sheet.stats.item}>
                            <Text style={style.sheet.stats.item.title}>{this.state.recording.getDistance()}
                                <Text style={style.sheet.stats.item.unit}> km</Text>
                            </Text>
                            <Text style={style.sheet.stats.item.description}>distance</Text>
                        </View>

                        <View style={style.sheet.stats.item}>
                            <Text style={style.sheet.stats.item.title}>{this.state.recording.getAverageSpeed()}
                                <Text style={style.sheet.stats.item.unit}> km/h</Text>
                            </Text>
                            <Text style={style.sheet.stats.item.description}>average speed</Text>
                        </View>

                        <View style={style.sheet.stats.item}>
                            <Text style={style.sheet.stats.item.title}>{this.state.recording.getElevation()}
                                <Text style={style.sheet.stats.item.unit}> m</Text>
                            </Text>
                            <Text style={style.sheet.stats.item.description}>elevation</Text>
                        </View>
                    </View>
                </View>

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
                        <Text style={style.sheet.user.texts.description}>{moment(this.state.data.timestamp).fromNow()} in Vänersborg</Text>
                    </View>
                </View>
                
                { this.props.onPress != undefined &&
                    <Button title="Show more details" onPress={() => this.props.onPress(this.state.data.id)}/>
                }
            </View>
        );
    }
};
