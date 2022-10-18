import React, { Component } from "react";
import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import MapView, { MAP_TYPES, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import moment from "moment";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

import ThemedComponent from "app/Components/ThemedComponent";
import Button from "app/Components/Button.component";
import Images from "app/Components/Images.component";
import Input from "app/Components/Input.component";

import Header from "app/Components/Layouts/Header.component"

import ActivityComments from "./Layouts/Pages/Activity/Comments";
import ActivityElevation from "./Layouts/Pages/Activity/Elevation";
import ActivitySpeed from "./Layouts/Pages/Activity/Speed";

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
        
        Cache.getActivityComments(this.props.id).then(async (comments) => {
            const collection = [];

            for(let index = 0; index < comments.length; index++) {
                collection[index] = await Cache.getActivityComment(comments[index]);
            }
            
            this.setState({ comments: collection });
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

    onExportPress() {

    };

    render() {
        if(this.state?.recording == null || this.state?.user == null) {
            // add a placeholder layout
            return null;
        }

        return (
            <>
                <Header
                    title="Activity"
                    navigation="true"
                    onNavigationPress={() => this.props.onClose()}
                    />
                
                <ScrollView style={style.sheet}>
                    <View style={style.sheet.section}>
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

                    {this.state?.comments && (
                        <TouchableOpacity style={[ style.sheet.comments, style.sheet.section, style.sheet.section.padded ]} onPress={() => this.setState({ showComments: true })}>
                            <Text style={style.sheet.section.header}>Comments <Text style={style.sheet.section.header.count}>({this.state?.comments.length})</Text></Text>
                        
                            {this.state?.comments.length?(
                                <View style={style.sheet.comments.snippet}>
                                    <Image
                                        style={style.sheet.comments.snippet.image}
                                        source={require("./../../assets/temp.jpg")}
                                    />

                                    <View style={style.sheet.comments.snippet.content}>
                                        <View style={style.sheet.comments.snippet.content.title}>
                                            <Text style={style.sheet.comments.snippet.content.author}>{this.state.comments[0].user.name}</Text>

                                            <Text style={style.sheet.comments.snippet.content.time}>{moment(this.state.comments[0].timestamp).fromNow()}</Text>
                                        </View>

                                        <Text numberOfLines={1} style={style.sheet.comments.snippet.content.description}>{this.state.comments[0].text}</Text>
                                    </View>
                                </View>
                            ):(
                                <View style={style.sheet.comments.write}>
                                    <View style={style.sheet.comments.write.avatar}>
                                        <Image
                                            style={style.sheet.comments.write.avatar.image}
                                            source={require("./../../assets/temp.jpg")}
                                        />
                                    </View>

                                    <View style={style.sheet.comments.write.content}>
                                        <Text style={style.sheet.comments.write.content.text}>Leave a comment...</Text>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    <View style={style.sheet.section}>
                        <Text style={[ style.sheet.section.header, style.sheet.section.padded ]}>Elevation Gain</Text>
                        
                        <ActivityElevation activity={this.props.id} width={"100%"} height={140}/>
                    </View>

                    <View style={style.sheet.section}>
                        <Text style={[ style.sheet.section.header, style.sheet.section.padded ]}>Speed</Text>
                        
                        <ActivitySpeed activity={this.props.id} width={"100%"} height={140}/>
                    </View>

                    <TouchableOpacity style={style.sheet.export} onPress={() => this.onExportPress()}>
                        <Text style={style.sheet.export.text}>Export recording as GPX</Text>
                    </TouchableOpacity>
                </ScrollView>

                {this.state?.showComments && (
                    <ActivityComments activity={this.props.id} onClose={() => this.setState({ showComments: false })}/>
                )}
            </>
        );
    }
};
