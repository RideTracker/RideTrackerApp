import React, { Component } from "react";
import { Text, View, Image, Appearance } from 'react-native';

import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import API from "../API";
import Config from "../config.json";
import Recording from "../Data/Recording";

import Button from "./Button.component";
import style from "./Activity.component.style";

const config = Config[(Appearance.getColorScheme() == "dark")?("dark"):("default")];

export default class Activity extends Component {
    ready = false;
    data = {};

    constructor(props) {
        super(props);

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
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            },
            animated: false
        });
    };

    render() {
        if(this.state?.recording == null || this.state?.user == null) {
            // add a placeholder layout
            return (
                <Text>Loading...</Text>
            );
        }

        return (
            <View style={style}>
                <MapView ref={this.mapView} style={style.map} customMapStyle={config.mapStyle} provider={PROVIDER_GOOGLE} onLayout={() => this.onLayout()}>
                    {this.state.recording != null && 
                        (this.state.recording.getLatLngCoordinates().map(section => (
                            <Polyline key={section.index} coordinates={section.coordinates} 
                                strokeColor={config.colorPalette.foreground}
                                strokeWidth={3}
                                lineJoin={"round"}
                            ></Polyline>
                        )))
                    }
                </MapView>

                <View style={style.user}>
                    <View>
                        <Image
                            style={style.user.image}
                            source={{
                                uri: `https://ride-tracker.nora-soderlund.se/users/${this.state.user.slug}/avatar.png`
                            }}
                        />
                    </View>

                    <View style={style.user.texts}>
                        <Text style={style.user.texts.title}>{this.state.user.name}</Text>
                        <Text style={style.user.texts.description}>Time ago in Vänersborg</Text>
                    </View>
                </View>

                <View style={style.stats}>
                    <View style={style.stats.item}>
                        <Text style={style.stats.item.title}>{this.state.recording.getDistance()} km</Text>
                        <Text style={style.stats.item.description}>distance</Text>
                    </View>

                    <View style={style.stats.item}>
                        <Text style={style.stats.item.title}>{this.state.recording.getAverageSpeed()} km/h</Text>
                        <Text style={style.stats.item.description}>average speed</Text>
                    </View>
                    
                    <View style={style.stats.item}>
                        <Text style={style.stats.item.title}>{this.state.recording.getElevation()} m</Text>
                        <Text style={style.stats.item.description}>elevation</Text>
                    </View>
                    
                    <View style={style.stats.item}>
                        <Text style={style.stats.item.title}>{this.state.recording.getMaxSpeed()} km/h</Text>
                        <Text style={style.stats.item.description}>max speed</Text>
                    </View>
                </View>
                
                { this.props.onPress != undefined &&
                    <Button title="Show more details" onPress={() => this.props.onPress(this.state.data.id)}/>
                }
            </View>
        );
    }
};
