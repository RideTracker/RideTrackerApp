import React, { Component } from "react";
import { Alert, TouchableOpacity, Text, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import ThemedComponent from "../../Components/ThemedComponent";
import Header from "../../Layouts/Header.component";
import Button from "../../Components/Button.component";
import API from "../../API";

import Config from "../../config.json";
import Recorder from "../../Data/Recorder";
import Appearance from "../../Data/Appearance";

import style from "./RecordPage.component.style";

export default class RecordPage extends ThemedComponent {
    style = style.update();

    recorder = new Recorder(true);

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

    onPositionUpdate(position) {
        console.log(position);
    };

    togglePause() {
        this.recorder.toggle();

        this.setState({});
    };

    async onFinish() {
        console.log("finish");

        if(this.recorder.active)
            this.recorder.stop();

        const result = await this.recorder.save();

        Alert.alert(this.recorder.data.meta.id + ".json", result);
    };

    onDiscard() {
        if(this.recorder.active)
            this.recorder.stop();

        this.props.onPageNavigation("home");
    };

    onLayout() {
        this.mapView.current.fitToCoordinates(this.recorder.getAllLatLngCoordinates(), {
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

    renderStats() {
        if(!this.recorder.active) {
            return (
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
                </View>
            );
        }
        
        return (
            <View style={style.sheet.stats}>
                <View style={[style.sheet.stats.item, style.sheet.stats.wide]}>
                    <Text style={[style.sheet.stats.item.title, style.sheet.stats.wide.title]}>{this.renderStateDuration()}</Text>

                    <Text style={style.sheet.stats.item.description}>duration</Text>
                </View>

                <View style={[style.sheet.stats.item, style.sheet.stats.wide]}>
                    <View style={style.sheet.stats.item.container}>
                        <Text style={[style.sheet.stats.item.title, style.sheet.stats.high.title]}>
                            <Text style={[style.sheet.stats.wide.text, style.sheet.stats.wide.text.hidden]}> km/h</Text>

                            {this.recorder.getAverageSpeed() ?? 0}
                            
                            <Text style={style.sheet.stats.wide.text}> km/h</Text>
                        </Text>
                    </View>
                </View>
                        
                <View style={style.sheet.stats.row}>
                    <View style={style.sheet.stats.item}>
                        <Text style={style.sheet.stats.item.title}>{this.recorder.getDistance() ?? 0} km</Text>
                        <Text style={style.sheet.stats.item.description}>distance</Text>
                    </View>
                
                    <View style={style.sheet.stats.item}>
                        <Text style={style.sheet.stats.item.title}>{this.recorder.getElevation() ?? 0} m</Text>
                        <Text style={style.sheet.stats.item.description}>elevation</Text>
                    </View>
                </View>
            </View>
        );
    };

    render() { 
        return (
            <View style={style.sheet}>
                <View>
                    {!this.recorder.active &&
                        [
                            (<Header key="header" title="Paused"/>),
                            
                            (<MapView ref={this.mapView} key="mapView" style={style.sheet.map} customMapStyle={Appearance.theme.mapStyle || []} provider={PROVIDER_GOOGLE} onLayout={() => this.onLayout()}>
                                {this.recorder != null && 
                                    (this.recorder.getLatLngCoordinates().map((section) => (
                                        <Polyline key={"index" + section.index} coordinates={section.coordinates} 
                                            strokeColor={"#FFF"}
                                            strokeWidth={3}
                                            lineJoin={"round"}
                                        ></Polyline>
                                    )))
                                }
                            </MapView>)
                        ]
                    }
                </View>

                <View style={style.sheet.stats}>
                    {this.renderStats()}
                </View>

                <View style={style.sheet.controls}>
                    <TouchableOpacity style={style.sheet.controls.button} onPress={() => this.togglePause()}>
                        <FontAwesome5 style={style.sheet.controls.button.icon} name={(!this.recorder.active)?("play-circle"):("stop-circle")} solid/>
                    </TouchableOpacity>
                </View>

                { !this.recorder.active &&
                    <View>
                        <Button title="Finish" onPress={() => this.onFinish()}/>
                        <Button title="Discard" confirm={{
                            message: "Do you really want to discard this ride?"
                        }} onPress={() => this.onDiscard()}/>
                    </View>
                }
            </View>
        );
    }
};
