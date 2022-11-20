import React from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import uuid from 'react-native-uuid';

import * as Location from 'expo-location';

import { getBoundsOfDistance, getDistance, getRhumbLineBearing } from "geolib";

import API from "app/Services/API";
import User from "app/Data/User";
import Files from "app/Data/Files";

import Appearance from "app/Data/Appearance";

import ThemedComponent from "app/Components/ThemedComponent";
import RouteCompact from "app/Components/RouteCompact.component";

import Header from "app/Components/Layouts/Header.component";

import { Form, Tabs } from "app/Components";

import style from "./Routes.component.style";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default class Routes extends ThemedComponent {
    style = style.update();

    modes = [
        {
            key: "default",

            render: () => {
                return (
                    <View style={style.sheet.static.routes}>
                        <Tabs default="routes">
                            <View id="routes" title="Your Routes">
                                <ScrollView>
                                    {(this.state?.routes)?(this.state.routes.map((route) => (
                                        <RouteCompact key={route} route={route} onPress={() => this.setMode("route", route)} onPlayPress={(directions) => this.props.showModal("RecordPage", { directions })}/>
                                    ))):(
                                        <View style={style.sheet.static.content}>
                                            <Text style={style.sheet.form.text}>You do not have any routes.</Text>
                                        </View>
                                    )}
                                </ScrollView>
                            </View>
                            
                            <View id="something" title="">

                            </View>
                        </Tabs>
                    </View>
                );
            },
            
            renderOverlay: () => {
                return (
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
                );
            },

            renderMapView: () => {
                
            },

            events: {
                onStart: async (directions) => {
                    const position = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.BestForNavigation
                    });
            
                    const bounds = getBoundsOfDistance(position.coords, 10000);
            
                    this.mapView.current.fitToCoordinates(bounds);

                    API.get("/api/v1/user/routes", { user: User.id }).then((response) => {
                        this.setState({ routes: response.content });
                    });
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
            key: "draw",
            title: "Sketch route\nwith brush",
            icon: "paint-brush",

            render: () => {
                return (
                    <View>
                        <View style={style.sheet.instructions} pointerEvents={"none"}>
                            <Text style={style.sheet.instructions.title}>Brush a route</Text>
                            <Text style={style.sheet.instructions.description}>Slide your finger across the map to generate a route.</Text>
                        </View>
                    </View>
                );
            },
            
            renderOverlay: () => {
                return (
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.footer}>
                            {(this.state?.mapViewControl)?(
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setState({ mapViewControl: false })}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"paint-brush"}/>
            
                                    <Text style={style.sheet.button.text}>Brush</Text>
                                </TouchableOpacity>
                            ):(
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setState({ mapViewControl: true })}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"arrows-alt"}/>

                                    <Text style={style.sheet.button.text}>Move</Text>
                                </TouchableOpacity>
                            )}

                            <View style={style.sheet.footer.disregard}>
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode("default")}>
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

                    const response = await API.post("/api/v1/directions/draw", { origin: this.state.coordinates[0], destination: this.state.coordinates[this.state.coordinates.length - 1], coordinates: finalCoordinates });
                    const result = response.content;

                    this.setMode("directions", result);
                },

                onFinish: () => {
                    this.setState({ coordinates: [] });
                }
            }
        },

        {
            key: "waypoints",
            title: "Draw with\nwaypoints",
            icon: "map-marker-alt",

            render: () => {
                return (
                    <View>
                        <View style={style.sheet.instructions}>
                            <Text style={style.sheet.instructions.title}>Plan a route</Text>
                            <Text style={style.sheet.instructions.description}>Press on the map to add a way point to generate a route or press on a waypoint to delete it.</Text>
                        </View>
                    </View>
                );
            },
            
            renderOverlay: () => {
                return (
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.footer}>
                            {(this.state?.waypoints?.length >= 2) && (
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.mode.events.onFinishPress()}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"check"}/>

                                    <Text style={style.sheet.button.text}>Finish</Text>
                                </TouchableOpacity>
                            )}

                            {(this.state?.mapViewControl)?(
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setState({ mapViewControl: false })}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"map-marker-alt"}/>
            
                                    <Text style={style.sheet.button.text}>Waypoints</Text>
                                </TouchableOpacity>
                            ):(
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setState({ mapViewControl: true })}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"arrows-alt"}/>

                                    <Text style={style.sheet.button.text}>Move</Text>
                                </TouchableOpacity>
                            )}

                            <View style={style.sheet.footer.disregard}>
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode("default")}>
                                    <FontAwesome5 style={style.sheet.button.icon} name={"times"}/>

                                    <Text style={style.sheet.button.text}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            },

            renderMapView: () => {
                return this.state?.waypoints?.map((waypoint, index, array) => (
                    <View key={waypoint.key}>
                        {(index > 0) && (
                            <Polyline
                                coordinates={[ array[index - 1].coordinate, waypoint.coordinate ]}
                                strokeWidth={3}
                                strokeColor={Appearance.theme.colorPalette.secondary}
                                />
                        )}

                        <Marker
                            coordinate={waypoint.coordinate}
                            pinColor={"linen"}
                            onPress={() => this.mode.events.onWaypointPress(waypoint)}
                            />
                    </View>
                ));
            },

            events: {
                onStart: async () => {
                    const position = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.BestForNavigation
                    });

                    this.setState({ mapViewControl: false, waypoints: [
                        {
                            key: "start",
                            coordinate: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                        }
                    ] });
                },

                onPressIn: () => {
                    //if(this.state.mapViewControl)
                    //    return;

                    //this.setState({ coordinates: [] });
                },

                onPress: (position) => {
                    if(this.state.mapViewControl)
                        return;

                    const waypoints = this.state.waypoints;
                    
                    if(waypoints.length == 10)
                        return;
                    
                    waypoints.push({
                        key: uuid.v4(),
                        coordinate: position.nativeEvent.coordinate
                    });

                    this.setState({ waypoints });
                },

                onWaypointPress: (waypoint) => {
                    this.setState({
                        waypoints: this.state.waypoints.filter((x) => x.key != waypoint.key)
                    });
                },

                onPanDrag: (position) => {

                },

                onPressOut: async () => {

                },

                onFinishPress: async () => {
                    const processing = this.props.showModal("Processing");
                    
                    const coordinates = this.state.waypoints.map((waypoint) => waypoint.coordinate);

                    const response = await API.post("/api/v1/directions/draw", { origin: coordinates[0], destination: coordinates[coordinates.length - 1], coordinates });
                    const result = response.content;

                    this.setMode("directions", result);

                    this.props.hideModal(processing);
                },

                onFinish: () => {
                    this.setState({ coordinates: [] });
                }
            }
        },

        {
            key: "directions",

            render: () => {
                if(!this.state?.directions)
                    return null;

                return (
                    <View style={style.sheet.static.content}>
                        <Text style={style.sheet.form.text}>Route Details</Text>
                        {(this.state.directions.summary) && (<Text style={style.sheet.form.description}>{this.state.directions.summary}</Text>)}

                        <View style={style.sheet.footer}>
                            <View style={style.sheet.stats}>
                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>{Math.round(this.state.directions.duration / 60)} <Text style={style.sheet.stats.item.unit}>min</Text></Text>
                                    <Text style={style.sheet.stats.item.description}>duration</Text>
                                </View>

                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>{Math.round((this.state.directions.distance / 1000) * 10) / 10} <Text style={style.sheet.stats.item.unit}>km</Text></Text>
                                    <Text style={style.sheet.stats.item.description}>distance</Text>
                                </View>

                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>? <Text style={style.sheet.stats.item.unit}>m</Text></Text>
                                    <Text style={style.sheet.stats.item.description}>elevation</Text>
                                </View>
                            </View>
                        </View>

                        <View style={style.sheet.form}>
                            <Text style={style.sheet.form.text}>Route Name</Text>
                            <Text style={style.sheet.form.description}>This will be visible to everyone with access to this route.</Text>

                            <Form.Input
                                ref={this.name}
                                style={style.sheet.form.input}
                                placeholder="Name (optional)"
                                clearButtonMode={"while-editing"}
                                enablesReturnKeyAutomatically={true}
                                keyboardType={"default"}
                                autoCapitalize={"sentences"}
                                returnKeyType={"done"}
                                onSubmitEditing={() => this.mode.events.onSubmit()}
                                />
                        </View>

                        <Form.Button branded title="Submit" onPress={() => this.mode.events.onSubmit()}/>
                        <Form.Button confirm title="Disregard" onPress={() => this.setMode("draw")}/>
                    </View>
                );
            },
            
            renderOverlay: () => {
                return null;
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
                        onLayout={() => this.mode.events.onLayout(coordinates)}
                        />
                ));
            },

            events: {
                onStart: async (directions) => {
                    this.name = React.createRef();

                    const response = await API.get("/api/v1/directions", { directions });
                    const result = response.content;

                    this.setState({ directions: result });
                },

                onPressIn: () => {
                    
                },

                onPanDrag: (position) => {
                    
                },

                onPressOut: async () => {
                    
                },

                onSubmit: async () => {
                    const processing = this.props.showModal("Processing");

                    const response = await API.post("/api/v1/route/create", {
                        directions: this.state.directions.id,
                        name: this.name.current.getValue()
                    });
                    const result = response.content;

                    this.setMode("route", result);

                    this.props.hideModal(processing);
                },

                onFinish: () => {
                    
                },

                onLayout: (coordinates) => {
                    this.mapView.current.fitToCoordinates(coordinates, {
                        edgePadding: {
                            top: 100,
                            right: 10,
                            bottom: 10,
                            left: 10
                        },

                        animated: false
                    });
                }
            }
        },
        
        {
            key: "route",

            render: () => {
                if(!this.state?.route || !this.state?.directions)
                    return null;

                return (
                    <View style={style.sheet.static.content}>
                        {(this.state.route.name)?(
                            <View>
                                <Text style={style.sheet.form.text}>{this.state.route.name}</Text>
                                <Text style={style.sheet.form.description}>{this.state.directions.summary}</Text>
                            </View>
                        ):(
                            <Text style={style.sheet.form.text}>{this.state.directions.summary}</Text>
                        )}

                        <View style={style.sheet.footer}>
                            <View style={style.sheet.stats}>
                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>{Math.round(this.state.directions.duration / 60)} <Text style={style.sheet.stats.item.unit}>min</Text></Text>
                                    <Text style={style.sheet.stats.item.description}>duration</Text>
                                </View>

                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>{Math.round((this.state.directions.distance / 1000) * 10) / 10} <Text style={style.sheet.stats.item.unit}>km</Text></Text>
                                    <Text style={style.sheet.stats.item.description}>distance</Text>
                                </View>

                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>? <Text style={style.sheet.stats.item.unit}>m</Text></Text>
                                    <Text style={style.sheet.stats.item.description}>elevation</Text>
                                </View>
                            </View>
                        </View>

                        {(this.state?.downloaded)?(
                            <Form.Button branded title={"Start recording"} onPress={() => this.props.showModal("RecordPage", { directions: this.state.directions.id })}/>
                        ):(
                            <Form.Button title={"Download directions"} onPress={() => this.mode.events.onDownloadPress()}/>
                        )}
                    </View>
                );
            },
            
            renderOverlay: () => {
                if(this.props.onClose)
                    return null;
                    
                return (
                    <View style={style.sheet.grid}>
                        <View style={style.sheet.footer}>
                            <View style={style.sheet.footer.disregard}>
                                <TouchableOpacity style={style.sheet.button} onPress={() => this.setMode("default")}>
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
                        onLayout={() => this.mode.events.onLayout(coordinates)}
                        />
                ));
            },

            events: {
                onStart: async (route) => {
                    const response = await API.get("/api/v1/route", { route });
                    const result = response.content;

                    const directions = await API.get("/api/v1/directions", { directions: result.directions });

                    this.setState({ route: result, directions: directions.content });

                    Files.exists(`directions/${directions.content.id}.json`).then((exists) => {
                        this.setState({ downloaded: exists });
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

                onDownloadPress: () => {
                    API.get("/api/v1/directions/download", { directions: this.state.directions.id }).then(async (data) => {
                        await Files.create("directions");
            
                        await Files.write(`directions/${this.state.directions.id}.json`, JSON.stringify(data.content));
            
                        this.setState({ downloaded: true });
                    });
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
        if(User.guest) {
            this.props.onNavigate("/index");

            this.props.showModal("LoginPage");

            return;
        }

        if(this.props?.route)
            this.setMode("route", this.props.route);
        else
            this.setMode("default");
            
        //this.setMode("directions", "95b15cf0-ea40-4f6c-ada0-a3c960276761");
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
                            showsUserLocation={true}
                            showsMyLocationButton={false}
                            pitchEnabled={this.state?.mapViewControl}
                            rotateEnabled={this.state?.mapViewControl}
                            scrollEnabled={this.state?.mapViewControl}
                            zoomEnabled={this.state?.mapViewControl}
                            onPress={(!this.state?.mapViewControl && this.mode && this.mode.events?.onPress)?((coordinate) => this.mode.events.onPress(coordinate)):(null)}
                            onPanDrag={(!this.state?.mapViewControl && this.mode)?((coordinate) => this.mode.events.onPanDrag(coordinate)):(null)}
                            >
                            {(this.state?.mode) && (this.mode.renderMapView())}
                        </MapView>
                    </TouchableWithoutFeedback>

                    <Header
                        title="Routes"
                        transparent
                        
                        navigation={this.props?.onClose}
                        onNavigationPress={() => this.props.onClose()}
                        />

                    {(this.state?.mode) && (this.mode.renderOverlay())}
                </View>
                
                <View style={style.sheet.static}>
                    {(this.state?.mode) && (this.mode.render())}
                </View>
            </View>
        );
    };
};
