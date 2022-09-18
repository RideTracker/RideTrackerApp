import React, { Component } from "react";
import { Text, View, Image } from 'react-native';

import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import API from "../API";
import Config from "../config.json";
import Recording from "../Data/Recording";

import Button from "./Button.component";
import style from "./Activity.component.style";

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
            this.data = data.content;

            API.get("/api/activity/summary", {
                id: this.props.id
            }).then((data) => {
                this.summary = data.content;
    
                API.get("/api/user", {
                    id: this.data.user
                }).then((data) => {
                    this.ready = true;
                    this.user = data.content;
        
                    this.setState({});
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
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            animated: false
        });
    };

    render() {
        if(!this.ready) {
            // add a placeholder layout
            return (
                <Text>Loading...</Text>
            );
        }

        return (
            <View style={style}>
                <MapView ref={this.mapView} style={style.map} customMapStyle={Config.mapStyle} provider={PROVIDER_GOOGLE} onLayout={() => this.onLayout()}>
                    {this.state.recording != null && 
                        (this.state.recording.getLatLngCoordinates().map(section => (
                            <Polyline key={section.index} coordinates={section.coordinates} 
                                strokeColor={"#FFF"}
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
                                uri: `https://ride-tracker.nora-soderlund.se/users/${this.user.slug}/avatar.png`
                            }}
                        />
                    </View>

                    <View style={style.user.texts}>
                        <Text style={style.user.texts.title}>{this.user.name}</Text>
                        <Text style={style.user.texts.description}>ago in Vänersborg</Text>
                    </View>
                </View>

                <View style={style.stats}>
                    {this.summary.map((summary) => (
                        <View key={summary.key} style={style.stats.item}>
                            <Text style={style.stats.item.title}>{summary.value}</Text>
                            <Text style={style.stats.item.description}>{summary.key}</Text>
                        </View>
                    ))}
                </View>
                
                { this.props.onPress != undefined &&
                    <Button title="Show more details" onPress={() => this.props.onPress(this.data.id)}/>
                }
            </View>
        );
    }
};
