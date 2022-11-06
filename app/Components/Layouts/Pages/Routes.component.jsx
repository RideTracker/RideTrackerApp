import React from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from 'expo-location';

import { getBoundsOfDistance, getDistance, getRhumbLineBearing } from "geolib";

import API from "app/Services/API";
import User from "app/Data/User";

import Appearance from "app/Data/Appearance";

import ThemedComponent from "app/Components/ThemedComponent";
import Button from "app/Components/Button.component";
import RouteCompact from "app/Components/RouteCompact.component";

import Header from "app/Components/Layouts/Header.component";

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

            },
            
            renderOverlay: () => {
                return (
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.instructions} pointerEvents={"none"}>
                            <Text style={style.sheet.instructions.title}>Draw a route</Text>
                            <Text style={style.sheet.instructions.description}>Slide your finger across the map to generate a route.</Text>
                        </View>

                        <View style={style.sheet.footer}>
                            {(this.state?.mapViewControl)?(
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setState({ mapViewControl: false })}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"pencil-alt"}/>
            
                                    <Text style={style.sheet.button.text}>Draw</Text>
                                </TouchableOpacity>
                            ):(
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setState({ mapViewControl: true })}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"arrows-alt"}/>

                                    <Text style={style.sheet.button.text}>Move</Text>
                                </TouchableOpacity>
                            )}

                            <View style={style.sheet.footer.disregard}>
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode(null)}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"times"}/>

                                    <Text style={style.sheet.button.text}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
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

                    this.state.coordinates.forEach((coordinate) => {
                        if(coordinates.length == 0)
                            return coordinates.push(coordinate);

                        const distance = getDistance(coordinates[coordinates.length - 1], coordinate);

                        if(distance > 5000 || (distance > 1000 && getRhumbLineBearing(coordinates[coordinates.length - 1], coordinate) > 45))
                            return coordinates.push(coordinate);
                    });

                    const finalCoordinates = [];

                    const step = Math.max(1, Math.floor(coordinates.length / 10));

                    for(let index = 0; index < coordinates.length; index += step)
                        finalCoordinates.push(coordinates[index]);

                    console.log(finalCoordinates);

                    const response = await API.post("/api/directions/draw", { origin: this.state.coordinates[0], destination: this.state.coordinates[this.state.coordinates.length - 1], coordinates: finalCoordinates });
                    const result = response.content;

                    this.setMode("directions", result);
                },

                onFinish: () => {
                    this.setState({ coordinates: [] });
                }
            }
        },

        {
            key: "directions",

            render: () => {

            },
            
            renderOverlay: () => {
                return (
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.footer}>
                            <View style={style.sheet.footer.disregard}>
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode(null)}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"times"}/>

                                    <Text style={style.sheet.button.text}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            },

            renderMapView: () => {
                if(!this.state?.directions)
                    return null;

                return this.state.directions.sections.map((coordinates, index) => (
                    <Polyline
                        key={index}
                        coordinates={coordinates}
                        strokeWidth={3}
                        strokeColor={Appearance.theme.colorPalette.route}
                        />
                ));
            },

            events: {
                onStart: async (directions) => {
                    const response = await API.get("/api/directions", { directions });
                    const result = response.content;

                    this.setState({ directions: result });
                },

                onPressIn: () => {
                    
                },

                onPanDrag: (position) => {
                    
                },

                onPressOut: async () => {
                    
                },

                onFinish: () => {
                    
                }
            }
        },
        
        {
            key: "route",

            render: () => {

            },
            
            renderOverlay: () => {
                return (
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.footer}>
                            <View style={style.sheet.footer.disregard}>
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode(null)}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"times"}/>

                                    <Text style={style.sheet.button.text}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            },

            renderMapView: () => {
                if(!this.state?.route)
                    return null;

                return this.state.route.sections.map((coordinates, index) => (
                    <Polyline
                        key={index}
                        coordinates={coordinates}
                        strokeWidth={3}
                        strokeColor={Appearance.theme.colorPalette.route}
                        onLayout={() => this.mode.events.onLayout(coordinates)}
                        />
                ));
            },

            events: {
                onStart: (route) => {
                    this.setState({ mapViewControl: true });

                    API.get("/api/route", { route }).then((response) => {
                        this.setState({
                            route: response.content
                        });
                    });
                },

                onPressIn: () => {
                    
                },

                onPanDrag: (position) => {
                    
                },

                onPressOut: async () => {
                    
                },

                onFinish: () => {

                },

                onLayout: (coordinates) => {
                    this.mapView.current.fitToCoordinates(coordinates);
                }
            }
        }
    ];

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
    };

    componentDidMount() {
        API.get("/api/user/routes", { user: User.id }).then((response) => {
            this.setState({ routes: response.content });
        });
    };

    async onLayout() {
        if(this.mode)
            return;

        const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation
        });

        const bounds = getBoundsOfDistance(position.coords, 10000);

        this.mapView.current.fitToCoordinates(bounds);
    };

    setMode(mode, ...args) {
        if(this.mode)
            this.mode.events.onFinish();

        // TODO: add a default mode
        this.mode = this.modes.find(x => x.key == mode);

        this.setState({ mapViewControl: true });

        if(this.mode)
            this.mode.events.onStart(...args);

        this.setState({ mode });
    };

    render() { 
        return (
            <View style={style.sheet}>
                <View style={style.sheet.dynamic}>
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
                        this.mode.renderOverlay()
                    ):(
                        <View style={style.sheet.grid}>
                            <View style={style.sheet.footer}>
                                <View style={style.sheet.footer.disregard}>
                                    {this.modes.filter((mode) => mode.icon).map((mode) => (
                                        <TouchableOpacity key={mode.key} style={style.sheet.button} onPress={() => this.setMode(mode.key)}>
                                            <FontAwesome5 style={style.sheet.button.icon} name={mode.icon}/>

                                            <Text style={style.sheet.button.text}>{mode.title}</Text>
                                        </TouchableOpacity>
                                    ))}

                                    <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode("route", "a7daa639-eae2-48f0-af7a-f19aada3cfa9")}>
                                        <FontAwesome5 style={style.sheet.button.icon} name={"question"}/>

                                        <Text style={style.sheet.button.text}>Debug</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
                
                <View style={style.sheet.static}>
                    {(this.state?.mode)?(this.mode.render()):(
                        <ScrollView style={style.sheet.static.routes}>
                            {(this.state?.routes) && this.state.routes.map((route) => (
                                <RouteCompact key={route} route={route} onPress={() => this.setMode("route", route)}/>
                            ))}

                            <View style={style.sheet.static.content}>
                                <Button branded title="Create a new route"/>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
        );
    };
};
