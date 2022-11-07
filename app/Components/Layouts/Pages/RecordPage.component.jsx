import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { getBoundsOfDistance } from "geolib";

import API from "app/Services/API";
import User from "app/Data/User";

import ThemedComponent from "app/Components/ThemedComponent";
import Button from "app/Components/Button.component";

import Header from "app/Components/Layouts/Header.component";

import Recorder from "app/Data/Recorder";
import Appearance from "app/Data/Appearance";

import style from "./RecordPage.component.style";

export default class RecordPage extends ThemedComponent {
    style = style.update();

    recorder = new Recorder(!User.guest, (position) => this.onPosition(position));

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
    }

    componentDidMount() {
        this.interval = setInterval(() => this.onInterval(), 1000);
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

        const bounds = getBoundsOfDistance(position.coords, 1000);

        this.mapView.current.fitToCoordinates(bounds, {
            edgePadding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },

            animated: false
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

        const content = await this.recorder.save();

        await API.put("/api/activity/upload", JSON.parse(content));

        //await Files.uploadFile(id);

        this.props.onNavigate("/index");

        //Alert.alert(this.recorder.data.meta.id + ".json", "Saved");
    };

    onDiscard() {
        if(this.recorder.active)
            this.recorder.stop();

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

    render() {
        return (
            <View style={style.sheet} now={this.state?.now}>
                {(this.recorder.active && !this.state?.map) && (
                    <MapView
                        ref={this.mapView}
                        style={style.sheet.map}
                        customMapStyle={Appearance.theme.mapStyle}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
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
                    </MapView>
                )}

                <Header title={(this.recorder.active)?("Recording"):("Paused")} transparent/>

                {(!this.recorder.active) && (
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
                    </MapView>
                )}

                <View style={style.sheet.footer}>
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

                    <View style={style.sheet.controls}>
                        <TouchableOpacity style={style.sheet.controls.button} onPress={() => this.togglePause()}>
                            <FontAwesome5 style={style.sheet.controls.button.icon} name={(!this.recorder.active)?("play-circle"):("stop-circle")} solid/>
                        </TouchableOpacity>
                    </View>

                    {(!this.recorder.active) &&
                        <View style={style.sheet.buttons}>
                            <Button title="Finish" onPress={() => this.onFinish()}/>

                            <Button title="Discard" confirm={{
                                message: "Do you really want to discard this ride?"
                            }} onPress={() => this.onDiscard()}/>
                        </View>
                    }
                </View>
            </View>
        );
    };
};
