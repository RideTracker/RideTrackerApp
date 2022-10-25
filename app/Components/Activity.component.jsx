import React, { Component } from "react";
import { Share, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import MapView, { MAP_TYPES, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import moment from "moment";

import API from "app/Services/API";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import User from "app/Data/User";
import Recording from "app/Data/Recording";

import ThemedComponent from "app/Components/ThemedComponent";
import Button from "app/Components/Button.component";
import Images from "app/Components/Images.component";
import Input from "app/Components/Input.component";
import Animation from "app/Components/Animation.component";

import Header from "app/Components/Layouts/Header.component"

import ActivityComments from "./Layouts/Pages/Activity/Comments";
import ActivityElevation from "./Layouts/Pages/Activity/Elevation";
import ActivitySpeed from "./Layouts/Pages/Activity/Speed";

import style from "./Activity.component.style";
import { TouchableNativeFeedback } from "react-native-web";

export default class Activity extends ThemedComponent {
    style = style.update();

    ready = false;
    data = {};
    progress = 0;
    requiredProgress = 4;

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

        API.get("/api/activity/likes", { activity: this.props.id }).then((data) => {
            if(!data.success)
                return;

            this.setState({ likes: data.content });
        });

        if(!User.guest) {
            API.get("/api/activity/like", { activity: this.props.id }).then((data) => {
                if(!data.success)
                    return;

                this.setState({ like: data.content });
            });
        }

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

        this.onProgress();
    };

    onProgress() {
        this.progress++;

        if(this.progress == this.requiredProgress) {
            this.setState({
                ready: true
            });
        }
    };

    onLikePress() {
        if(!User.guest) {
            API.post("/api/activity/like", { activity: this.props.id }).then((data) => {
                if(!data.success)
                    return;

                this.setState({ like: data.content });

                API.get("/api/activity/likes", { activity: this.props.id }).then((data) => {
                    if(!data.success)
                        return;
        
                    this.setState({ likes: data.content });
                });
            });
        }
    };

    async onSharePress() {
        try {
            const result = await Share.share({
                message: "View my activity on Ride Tracker!",
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        }
        catch(error) {
            alert(error.message);
        }
    };

    render() {
        if(this.state?.recording == null || this.state?.user == null) {
            // add a placeholder layout
            return null;
        }

        return (
            <Animation
                enabled={this.state?.ready}
                duration={200}
                transitions={[
                    {
                        type: "left",
                        duration: 200
                    }
                ]}
                style={this.props?.style}
                >
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
                                animation={false}
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
                        
                        <View style={style.sheet.buttons}>
                            <TouchableOpacity style={style.sheet.buttons.button} onPress={() => this.onLikePress()}>
                                <FontAwesome5 style={style.sheet.buttons.button.icon} name={"heart"} solid={this.state?.like}/>
                                
                                <Text style={style.sheet.buttons.button.label}>{(this.state?.likes > 0)?(this.state.likes + " likes"):("Like")}</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={style.sheet.buttons.button} onPress={() => this.onSharePress()}>
                                <FontAwesome5 style={[ style.sheet.buttons.button.icon, { marginLeft: 6 } ]} name={"share-square"}/>
                                
                                <Text style={style.sheet.buttons.button.label}>Share</Text>
                            </TouchableOpacity>

                            { this.state.user.id == User.id && (
                                <TouchableOpacity style={style.sheet.buttons.button}>
                                    <Text style={[ style.sheet.buttons.button.label, { fontSize: 14, marginBottom: 2 } ]}>Export as</Text>
                                    <Text style={style.sheet.buttons.button.label}>GPX</Text>
                                </TouchableOpacity>
                            )}
                        </View>
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
                        
                        <ActivityElevation
                            onReady={() => this.onProgress()}
                            activity={this.props.id}
                            width={"100%"}
                            height={140}
                            />
                    </View>

                    <View style={style.sheet.section}>
                        <Text style={[ style.sheet.section.header, style.sheet.section.padded ]}>Speed</Text>
                        
                        <ActivitySpeed
                            onReady={() => this.onProgress()}
                            activity={this.props.id}
                            width={"100%"}
                            height={140}
                            />
                    </View>
                </ScrollView>

                {this.state?.showComments && (
                    <ActivityComments activity={this.props.id} onClose={() => this.setState({ showComments: false })}/>
                )}
            </Animation>
        );
    }
};
