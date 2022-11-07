import React, { Component } from "react";
import { Image, View, Text, TouchableWithoutFeedback, PixelRatio } from "react-native";
import MapView, { Polygon, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { getBounds } from "geolib";

import Appearance from "app/Data/Appearance";

import API from "app/Services/API";

import style from "./RouteCompact.component.style";

export default class RouteCompact extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
    };

    componentDidMount() {
        API.get("/api/route", { route: this.props.route }).then((data) => {
            this.setState({ route: data.content });

            API.get("/api/directions", { directions: data.content.directions }).then((data) => {
                this.setState({ directions: data.content });
            });
        });
    };

    onLayout(coordinates) {
        this.mapView.current.fitToCoordinates(coordinates, {
            animated: false,
            edgePadding: {
                top: 0,
                bottom: 5,
                
                left: 0,
                right: 0
            }
        });

        this.setState({ ready: true });
    };

    render() {
        if(!this.state?.directions || !this.state?.route)
            return null;

        return (
            <TouchableWithoutFeedback style={[ style.sheet, this.props?.style ]} onPress={() => this.props.onPress(this.props.route)}>
                <View style={style.sheet.grid}>
                    <MapView
                        ref={this.mapView}
                        customMapStyle={[ ...Appearance.theme.mapStyle, ...Appearance.theme.mapStyleCompact ]}
                        userInterfaceStyle={"light"}
                        provider={PROVIDER_GOOGLE}
                        pitchEnabled={false}
                        rotateEnabled={false}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        style={[ style.sheet.map, { opacity: ((this.state?.ready)?(1):(0)) }]}
                        >
                            <Polygon
                                coordinates={[
                                    { latitude: 180, longitude: 85 },
                                    { latitude: 90, longitude: 85 },
                                    { latitude: 0, longitude: 85 },
                                    { latitude: -90, longitude: 85 },
                                    { latitude: -180, longitude: 85 },
                                    { latitude: -180, longitude: 0 },
                                    { latitude: -180, longitude: -85 },
                                    { latitude: -90, longitude: -85 },
                                    { latitude: 0, longitude: -85 },
                                    { latitude: 90, longitude: -85 },
                                    { latitude: 180, longitude: -85 },
                                    { latitude: 180, longitude: 0 },
                                    { latitude: 180, longitude: 85 }
                                ]}
                                fillColor={Appearance.theme.colorPalette.common}
                                />

                        {this.state.directions.sections.map((coordinates, index) => (
                            <Polyline
                                key={index}
                                coordinates={coordinates}
                                strokeWidth={3}
                                strokeColor={Appearance.theme.colorPalette.route}
                                onLayout={() => this.onLayout(coordinates)}
                                />
                        ))}
                    </MapView>

                    <View style={style.sheet.grid.stretch}>
                        <Text style={style.sheet.text}>{(this.state.route.name)?(this.state.route.name):(this.state.directions.summary)}</Text>

                        <View style={style.sheet.stats}>
                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>{Math.round(this.state.directions.duration / 60)} min</Text>
                                <Text style={style.sheet.stats.item.description}>duration</Text>
                            </View>
                            
                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>{Math.round(this.state.directions.distance / 1000)} km</Text>
                                <Text style={style.sheet.stats.item.description}>distance</Text>
                            </View>
                            
                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>? m</Text>
                                <Text style={style.sheet.stats.item.description}>elevation</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
};
