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
        });
    };

    onLayout(coordinates) {
        this.mapView.current.fitToCoordinates(coordinates, {
            animated: false,
            edgePadding: {
                top: 0,
                bottom: 10,
                
                left: 0,
                right: 0
            }
        });

        this.setState({ ready: true });
    };

    render() {
        return (
            <TouchableWithoutFeedback style={[ style.sheet, this.props?.style ]} onPress={() => this.props.onPress(this.props.route)}>
                <View>
                    {(this.state?.route) && (
                        <MapView
                            ref={this.mapView}
                            customMapStyle={Appearance.theme.mapStyleCompact || []}
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

                            {this.state.route.sections.map((coordinates, index) => (
                                <Polyline
                                    key={index}
                                    coordinates={coordinates}
                                    strokeWidth={3}
                                    strokeColor={Appearance.theme.colorPalette.route}
                                    onLayout={() => this.onLayout(coordinates)}
                                    />
                            ))}
                        </MapView>
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    };
};
