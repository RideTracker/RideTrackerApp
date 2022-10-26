import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import moment from "moment";

import Button from "app/Components/Button.component";
import ThemedComponent from "app/Components/ThemedComponent";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

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
        console.log("load " + this.props.id);
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
                top: 5,
                right: 5,
                bottom: 60,
                left: 5
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
                    <MapView
                        ref={this.mapView}
                        style={style.sheet.map.view}
                        customMapStyle={Appearance.theme.mapStyleCompact || []}
                        provider={PROVIDER_GOOGLE}
                        onLayout={() => this.onLayout()}
                        pitchEnabled={false}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                    >
                        {this.state.recording != null && 
                            (this.state.recording.getMapCoordinates().map(section => (
                                <Polyline key={section.index} coordinates={section.coordinates} 
                                    strokeColor={Appearance.theme.colorPalette.route}
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
                            source={require("./../../assets/temp.jpg")}
                        />
                    </View>

                    <View style={style.sheet.user.texts}>
                        <Text style={style.sheet.user.texts.title}>{this.state.user.name}</Text>
                        <Text style={style.sheet.user.texts.description}>{moment(this.state.activity.timestamp).fromNow()} in Vänersborg</Text>
                    </View>
                </View>

                <TouchableOpacity
                    useOpacity={0}
                    style={[ style.sheet.clickable, (this.state?.pressing && style.sheet.clickable.pressing) ]}
                    onPress={() => this.props.onPress(this.state.activity.id)}
                    onPressIn={() => this.setState({ pressing: true })}
                    onPressOut={() => this.setState({ pressing: false })}
                    />
            </View>
        );
    }
};
