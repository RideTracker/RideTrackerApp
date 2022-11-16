import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import uuid from "react-native-uuid";

import * as Location from "expo-location";

import { getBoundsOfDistance, getDistance } from "geolib";

import { decode } from "@googlemaps/polyline-codec";

import API from "app/Services/API";
import User from "app/Data/User";

import ThemedComponent from "app/Components/ThemedComponent";
import Button from "app/Components/Button.component";

import Header from "app/Components/Layouts/Header.component";

import Recorder from "app/Data/Recorder";
import Appearance from "app/Data/Appearance";
import Files from "app/Data/Files";

import style from "./RecordPage.component.style";

const images = {
    "merge": require("assets/directions/merge.png"),
    "merge-left": require("assets/directions/merge-left.png"),
    "merge-right": require("assets/directions/merge-right.png"),
    "merge-slight-left": require("assets/directions/merge-slight-left.png"),
    "merge-slight-right": require("assets/directions/merge-slight-right.png"),
    "roundabout": require("assets/directions/roundabout.png"),
    "straight": require("assets/directions/straight.png"),
    "turn-left": require("assets/directions/turn-left.png"),
    "turn-right": require("assets/directions/turn-right.png"),
    "turn-sharp-left": require("assets/directions/turn-sharp-left.png"),
    "turn-sharp-right": require("assets/directions/turn-sharp-right.png"),
    "turn-slight-left": require("assets/directions/turn-slight-left.png"),
    "turn-slight-right": require("assets/directions/turn-slight-right.png")
};

export default class RecordPage extends ThemedComponent {
    style = style.update();

    recorder = new Recorder(false, (position) => this.onPosition(position));

    shouldUpdateCamera = true;

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
    }

    async componentDidMount() {
        this.interval = setInterval(() => this.onInterval(), 1000);

        if(this.props.directions) {
            Files.read(`directions/${this.props.directions}.json`).then((directions) => {
                directions = JSON.parse(directions);

                this.setState({
                    directions,

                    polyline: decode(directions.routes[0].overview_polyline.points, 5).map((points) => { return { latitude: points[0], longitude: points[1] } })
                });

                //if(!this.recorder.active)
                //    this.recorder.start();
            });
        }
        
        Location.getBackgroundPermissionsAsync().then((permissions) => {
            this.setState({
                hasBackgroundLocation: permissions.granted
            });
        });

        const permissions = await Location.getForegroundPermissionsAsync();

        if(!permissions.granted)
            return;

        Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation
        }).then((position) => {
            this.mapView.current.fitToCoordinates([ position.coords ], {
                animated: false
            });
        });
    };

    componentDidUpdate() {
        Location.getBackgroundPermissionsAsync().then((permissions) => {
            this.setState({
                hasBackgroundLocation: permissions.granted
            });
        });
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onInterval() {
        if(!this.recorder.active)
            return;

        this.setState({
            duration: this.recorder.getDuration(),
            speed: Math.round(this.recorder.getSpeed() * 10) / 10
        });
    };

    onPosition(position) {
        if(!this.mapView?.current)
            return;

        if(!this.state?.freeCamera) {
            const bounds = getBoundsOfDistance(position.coords, 200);
    
            this.mapView.current.fitToCoordinates(bounds, {
                edgePadding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                },
    
                animated: false
            });
        }

        if(this.state?.directions)
            this.updateDirections(position);
    };

    updateDirections(position) {
        const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        const legs = this.state.directions.routes[0].legs.sort((a, b) => {
            const aDistance = getDistance(coordinates, {
                latitude: a.start_location.lat,
                longitude: a.start_location.lng
            });

            const bDistance = getDistance(coordinates, {
                latitude: b.start_location.lat,
                longitude: b.start_location.lng
            });

            return (aDistance - bDistance);
        });

        const leg = legs[0];

        leg.steps.forEach((step) => {
            step.user_distance = getDistance(coordinates, {
                latitude: step.start_location.lat,
                longitude: step.start_location.lng
            });
        })

        const steps = leg.steps.sort((a, b) => {
            return (a.user_distance - b.user_distance);
        });

        const step = steps[0];

        let distance = {};

        if(step.user_distance < 1000) {
            distance = {
                value: Math.floor(step.user_distance / 10) * 10,
                unit: "m"
            }
        }
        else {
            distance = {
                value: Math.floor((step.user_distance / 1000) * 10) / 10,
                unit: "km"
            }
        }

        this.setState({
            direction: {
                distance,
                maneuver: step.maneuver ?? null,
                street: leg.start_address.substring(0, leg.start_address.indexOf(',')),
                instruction: step.html_instructions.replace(/<\/?b[^>]*>/g, '').replace(/<\/?div[^>]*>/g, '\n') ?? "",
                polyline: decode(step.polyline.points, 5).map((points) => { return { latitude: points[0], longitude: points[1] } })
            }
        });
    };

    togglePause() {
        this.recorder.toggle();

        this.setState({ now: performance.now() });
    };

    toggleMap() {
        this.setState({ map: !(this.state?.map) })
    };

    async onFinish() {
        if(this.recorder.active)
            this.recorder.stop();

        //const processing = this.props.showModal("Processing");

        const id = uuid.v4();

        Files.write(`/recordings/local/${id}.json`, JSON.stringify(this.recorder.data));

        this.props.showModal("ActivityUpload", {
            recording: id,
            onFinish: (activity) => {
                this.props.onNavigate("/index");

                this.props.showModal("Activity", { id: activity });
            }
        });

        //await API.put("/api/v1/activity/upload", this.recorder.data);

        //await Files.uploadFile(id);

        //this.props.onNavigate("/index");

        //this.props.hideModal(processing);

        //Alert.alert(this.recorder.data.meta.id + ".json", "Saved");
    };

    onDiscard() {
        if(this.recorder.active)
            this.recorder.stop();

        if(this.props.onClose)
            this.props.onClose();
        else
            this.props.onNavigate("/index");
    };

    onLayout() {
        const coordinates = this.recorder.getAllLatLngCoordinates();

        this.mapView.current.fitToCoordinates(coordinates, {
            edgePadding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            
            animated: false
        });
    };

    renderStateDuration() {
        let duration = (this.state?.duration || 0) / 1000;

        let result = [];

        let hours = Math.floor(duration / 60 / 60);
        duration -= hours * 60 * 60;
        result.push((hours < 10 && "0") + hours);

        let minutes = Math.floor(duration / 60);
        duration -= minutes * 60;
        result.push((minutes < 10 && "0") + minutes);

        duration = Math.floor(duration);
        result.push((duration < 10 && "0") + duration);

        return result.join(':');
    };

    onStart() {
        this.recorder.start();

        this.setState({ started: true });
    };

    render() {
        return (
            <View style={style.sheet} now={this.state?.now}>
                {((this.recorder.active || !this.state?.started) && !this.state?.map) && (
                    <MapView
                        ref={this.mapView}
                        style={style.sheet.map}
                        customMapStyle={Appearance.theme.mapStyle}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        maxZoomLevel={16}
                        onPanDrag={() => !this.state?.freeCamera && this.setState({ freeCamera: true })}
                        >
                        {(this.state?.polyline) && (
                            <Polyline
                                coordinates={this.state.polyline} 
                                strokeColor={Appearance.theme.colorPalette.routeDarker}
                                strokeWidth={5}
                                lineJoin={"round"}
                                />
                        )}

                        {(this.state?.direction?.polyline) && (
                            <Polyline
                                coordinates={this.state.direction.polyline} 
                                strokeColor={Appearance.theme.colorPalette.route}
                                strokeWidth={5}
                                lineJoin={"round"}
                                />
                        )}

                        {this.recorder != null && 
                            (this.recorder.getLatLngCoordinates().map((section, index, array) => (
                                <Polyline key={"index" + section.index} coordinates={section.coordinates} 
                                    strokeColor={"#FFF"}
                                    strokeWidth={5}
                                    lineJoin={"round"}
                                ></Polyline>
                            )))
                        }
                    </MapView>
                )}

                <Header title={(this.recorder.active || !this.state?.started)?("Recording"):("Paused")} transparent/>

                {(!this.recorder.active && this.state?.started) && (
                    <MapView
                        ref={this.mapView}
                        style={style.sheet.mapCompact}
                        customMapStyle={Appearance.theme.mapStyle}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        onLayout={() => this.onLayout()}
                        maxZoomLevel={16}
                        >
                        {this.recorder != null && 
                            (this.recorder.getLatLngCoordinates().map((section, index, array) => (
                                <Polyline key={"index" + section.index} coordinates={section.coordinates} 
                                    strokeColor={"#FFF"}
                                    strokeWidth={3}
                                    lineJoin={"round"}
                                ></Polyline>
                            )))
                        }

                        {(this.state?.polyline) && (
                            <Polyline
                                coordinates={this.state.polyline} 
                                strokeColor={Appearance.theme.colorPalette.routeDarker}
                                strokeWidth={5}
                                lineJoin={"round"}
                                />
                        )}

                        {(this.state?.direction?.polyline) && (
                            <Polyline
                                coordinates={this.state.direction.polyline} 
                                strokeColor={Appearance.theme.colorPalette.route}
                                strokeWidth={5}
                                lineJoin={"round"}
                                />
                        )}
                    </MapView>
                )}

                <View style={style.sheet.footer}>
                    {(this.state?.hasBackgroundLocation == false) && (
                        <View style={style.sheet.warning}>
                            <Text style={style.sheet.warning.title}>Warning!</Text>

                            <Text style={style.sheet.warning.description}>You have not granted Ride Tracker background location access and you won't be able to track your position with the screen closed.</Text>
                        </View>
                    )}

                    {(this.state?.started)?(
                        <>
                            <View style={style.sheet.controls}>
                                <View style={style.sheet.controls.button}>
                                    <FontAwesome5 style={style.sheet.controls.button.iconSideInvisible} name={"map-marker-alt"}/>
                                </View>

                                <TouchableOpacity style={style.sheet.controls.button} onPress={() => this.togglePause()}>
                                    <FontAwesome5 style={style.sheet.controls.button.icon} name={(!this.recorder.active)?("play-circle"):("stop-circle")} solid/>
                                </TouchableOpacity>

                                <TouchableOpacity style={style.sheet.controls.button} onPress={() => this.setState({ freeCamera: false })}>
                                    <FontAwesome5 style={(this.recorder.active && this.state?.freeCamera)?(style.sheet.controls.button.iconSide):(style.sheet.controls.button.iconSideInvisible)} name={"map-marker-alt"}/>
                                </TouchableOpacity>
                            </View>

                            <View style={style.sheet.stats}>
                                <View style={style.sheet.stats.row}>
                                    <View style={style.sheet.stats.column}>
                                        <Text style={style.sheet.stats.column.title}>{this.renderStateDuration()}</Text>
                                        <Text style={style.sheet.stats.column.description}>duration</Text>
                                    </View>

                                    <View style={style.sheet.stats.column}>
                                        <Text style={style.sheet.stats.column.title}>{this.state?.speed ?? 0} km/h</Text>
                                        <Text style={style.sheet.stats.column.description}>speed</Text>
                                    </View>
                                </View>

                                {(!this.recorder.active) && (
                                    <View style={style.sheet.stats.row}>
                                        <View style={style.sheet.stats.column}>
                                            <Text style={style.sheet.stats.column.title}>0.00 km</Text>
                                            <Text style={style.sheet.stats.column.description}>distance</Text>
                                        </View>

                                        <View style={style.sheet.stats.column}>
                                            <Text style={style.sheet.stats.column.title}>0 m</Text>
                                            <Text style={style.sheet.stats.column.description}>elevation</Text>
                                        </View>
                                    </View>
                                )}
                            </View>

                            <View style={style.sheet.footer.section}>
                                {(this.recorder.active && this.state?.direction) && (
                                    <View style={style.sheet.directions}>
                                        <View style={style.sheet.directions.upcoming}>
                                            {(this.state.direction.maneuver) && (
                                                <Image
                                                    style={style.sheet.directions.upcoming.image}
                                                    source={images[this.state.direction.maneuver]}
                                                    />
                                            )}

                                            <Text style={style.sheet.directions.upcoming.text}>{this.state.direction.distance.value} <Text style={style.sheet.directions.upcoming.unit}>{this.state.direction.distance.unit}</Text></Text>
                                        </View>

                                        <View style={style.sheet.directions.street}>
                                            <Text style={style.sheet.directions.street.text}>{this.state.direction.street}</Text>
                                            <Text style={style.sheet.directions.street.instruction}>{this.state.direction.instruction}</Text>
                                        </View>
                                    </View>
                                )}

                                {(!this.recorder.active) &&
                                    <View style={style.sheet.buttons}>
                                        <Button title="Finish" onPress={() => this.onFinish()}/>

                                        <Button title="Discard" confirm={{
                                            message: "Do you really want to discard this ride?"
                                        }} onPress={() => this.onDiscard()}/>
                                    </View>
                                }
                            </View>
                        </>
                    ):(
                        <>
                            <Button
                                style={{ margin: 12 }}
                                branded
                                title={"Start recording"}
                                onPress={() => this.onStart()}
                                />
                                
                            <Button
                                style={{ margin: 12 }}
                                transparent
                                title={"Cancel"}
                                onPress={() => this.props.onNavigate("/index")}
                                />
                        </>
                    )}
                </View>
            </View>
        );
    };
};
