import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import MapView, { MAP_TYPES, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import moment from "moment";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

import ThemedComponent from "app/Components/ThemedComponent";
import Button from "app/Components/Button.component";
import Images from "app/Components/Images.component";

import style from "./Activity.component.style";

export default class Activity extends ThemedComponent {
    style = style.update();

    ready = false;
    data = {};

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
        this.mapViewSatellite = React.createRef();
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

    onLayout(reference) {
        reference.current.fitToCoordinates(this.state.recording.getAllLatLngCoordinates(), {
            edgePadding: {
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
            },
            animated: false
        });

        reference.current.setCamera({
            pitch: reference.current.props?.pitch || 0,
            heading: reference.current.props?.heading || 0
        });
    };

    render() {
        if(this.state?.recording == null || this.state?.user == null) {
            // add a placeholder layout
            return null;
        }

        return (
            <View style={style.sheet}>
                <Images height={style.sheet.map.height}>
                    <MapView
                        ref={this.mapView}
                        style={style.sheet.map}
                        customMapStyle={Appearance.theme.mapStyle || []}
                        provider={PROVIDER_GOOGLE}
                        onLayout={() => this.onLayout(this.mapView)}
                        pitchEnabled={false}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        >
                        {this.state.recording != null && 
                            (this.state.recording.getLatLngCoordinates().map(section => (
                                <Polyline key={section.index} coordinates={section.coordinates} 
                                    strokeColor={Appearance.theme.colorPalette.route}
                                    strokeWidth={3}
                                    lineJoin={"round"}
                                ></Polyline>
                            )))
                        }
                    </MapView>
                    
                    <MapView
                        ref={this.mapViewSatellite}
                        style={style.sheet.map}
                        mapType={MAP_TYPES.HYBRID}
                        provider={PROVIDER_GOOGLE}
                        pitch={90}
                        onLayout={() => this.onLayout(this.mapViewSatellite)}
                        pitchEnabled={false}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        >
                        {this.state.recording != null && 
                            (this.state.recording.getLatLngCoordinates().map(section => (
                                <Polyline key={section.index} coordinates={section.coordinates} 
                                    strokeColor={Appearance.theme.colorPalette.route}
                                    strokeWidth={3}
                                    lineJoin={"round"}
                                ></Polyline>
                            )))
                        }
                    </MapView>
                </Images>

                <View style={style.sheet.user}>
                    <View>
                        <Image
                            style={style.sheet.user.image}
                            source={require("./../../assets/temp.jpg")}
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
