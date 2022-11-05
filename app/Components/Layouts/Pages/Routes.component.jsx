import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Switch, TouchableWithoutFeedbackBase, TouchableOpacityBase, TouchableWithoutFeedback } from "react-native";
import MapView, { MAP_TYPES, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from 'expo-location';

import { getBoundsOfDistance } from "geolib";

import API from "app/Services/API";

import Config from "app/Data/Config";
import Appearance from "app/Data/Appearance";
import Themes from "app/Data/Config/Themes.json";

import ThemedComponent from "app/Components/ThemedComponent";

import Header from "app/Components/Layouts/Header.component";
import Footer from "app/Components/Layouts/Footer.component";

import style from "./Routes.component.style";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default class Routes extends ThemedComponent {
    style = style.update();

    modes = [
        {
            key: "draw",
            title: "Draw a route",
            icon: "pencil-ruler",
            
            render: () => {
                return (
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.instructions} pointerEvents={"none"}>
                            <Text style={style.sheet.instructions.title}>Draw a route</Text>
                            <Text style={style.sheet.instructions.description}>Slide your finger across the map to generate a route.</Text>
                        </View>

                        <View style={style.sheet.footer}>
                            {(this.state?.mapViewControl)?(
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setState({ mapViewControl: false })}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"pencil-ruler"}/>
            
                                    <Text style={style.sheet.button.text}>Draw</Text>
                                </TouchableOpacity>
                            ):(
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setState({ mapViewControl: true })}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"arrows-alt"}/>

                                    <Text style={style.sheet.button.text}>Move</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode(null)}>
                                <FontAwesome5 style={style.sheet.button.icon} name={"times"}/>

                                <Text style={style.sheet.button.text}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            },

            renderMapView: () => {
                return (
                    <Polyline
                        coordinates={[...(this.state?.coordinates ?? [])]}
                        strokeWidth={3}
                        strokeColor={Appearance.theme.colorPalette.secondary}
                        />
                );
            },

            events: {
                onStart: () => {
                    this.setState({ mapViewControl: false });
                },

                onPressIn: () => {
                    if(this.state.mapViewControl)
                        return;

                    this.setState({ coordinates: [] });
                },

                onPanDrag: (position) => {
                    if(this.state.mapViewControl)
                        return;

                    const coordinates = this.state.coordinates;
                    coordinates.push(position.nativeEvent.coordinate);

                    this.setState({ coordinates });
                },

                onPressOut: async () => {
                    if(this.state.mapViewControl)
                        return;

                    const coordinates = [];
                    const step = Math.max(1, Math.floor(this.state.coordinates.length / 10));

                    for(let index = 0; index < this.state.coordinates.length; index += step)
                        coordinates.push(this.state.coordinates[index]);

                    const response = await API.post("/api/routes/draw", { coordinates });
                    const result = response.content;

                    this.setMode("directions", result);
                }
            }
        },
        
        {
            key: "directions",
            
            render: () => {
                return (
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.footer}>
                            <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode(null)}>
                                <FontAwesome5 style={style.sheet.button.icon} name={"times"}/>

                                <Text style={style.sheet.button.text}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            },

            renderMapView: () => {
                return null;
            },

            events: {
                onStart: () => {
                    this.setState({ mapViewControl: true });
                },

                onPressIn: () => {
                    
                },

                onPanDrag: (position) => {
                    
                },

                onPressOut: async () => {
                    
                }
            }
        }
    ];

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
    };

    async onLayout() {
        const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation
        });

        const bounds = getBoundsOfDistance(position.coords, 10000);

        this.mapView.current.fitToCoordinates(bounds);
    };

    setMode(mode, ...args) {
        this.mode = this.modes.find(x => x.key == mode);

        this.setState({ mapViewControl: true });

        if(this.mode)
            this.mode.events.onStart(...args);

        this.setState({ mode });
    };

    render() { 
        return (
            <View style={style.sheet}>
                <TouchableWithoutFeedback
                    onPressIn={() => this.mode && this.mode.events.onPressIn()}
                    onPressOut={() => this.mode && this.mode.events.onPressOut()}
                    >
                    <MapView
                        ref={this.mapView}
                        style={style.sheet.map}
                        customMapStyle={Appearance.theme.mapStyle || []}
                        provider={PROVIDER_GOOGLE}
                        onLayout={() => this.onLayout()}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        pitchEnabled={this.state?.mapViewControl}
                        rotateEnabled={this.state?.mapViewControl}
                        scrollEnabled={this.state?.mapViewControl}
                        zoomEnabled={this.state?.mapViewControl}
                        onPanDrag={(!this.state?.mapViewControl && this.mode)?((coordinate) => this.mode.events.onPanDrag(coordinate)):(null)}
                        >
                        {(this.state?.mode) && (this.mode.renderMapView())}
                    </MapView>
                </TouchableWithoutFeedback>

                <Header title="Routes" transparent/>

                {(this.state?.mode)?(
                    this.mode.render()
                ):(
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.footer}>
                            {this.modes.filter((mode) => mode.icon).map((mode) => (
                                <TouchableOpacity key={mode.key} style={style.sheet.button} onPress={() => this.setMode(mode.key)}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={mode.icon}/>

                                    <Text style={style.sheet.button.text}>{mode.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        );
    };
};
