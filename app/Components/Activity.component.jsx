import React from "react";
import { Share, Text, View, ScrollView, Image, TouchableOpacity, Linking, TouchableWithoutFeedbackBase } from "react-native";
import MapView, { MAP_TYPES, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import moment from "moment";

import { getDistance, getRhumbLineBearing } from "geolib";

import API from "app/Services/API";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import User from "app/Data/User";
import Recording from "app/Data/Recording";
import Config from "app/Data/Config";

import ThemedComponent from "app/Components/ThemedComponent";

import ActivityPlayback from "./Layouts/Pages/Activity/Playback";
import ActivityComments from "./Layouts/Pages/Activity/Comments";
import ActivityElevation from "./Layouts/Pages/Activity/Elevation";
import ActivitySpeed from "./Layouts/Pages/Activity/Speed";

import { Page, Form, Images } from "app/Components";
import { Bike } from "app/Layouts";

import style from "./Activity.component.style";

import Settings from "app/Settings";

export default class Activity extends ThemedComponent {
    style = style.update();

    ready = false;
    data = {};
    progress = 0;
    requiredProgress = 4;

    constructor(...args) {
        super(...args);

        this.page = React.createRef();

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

        API.get("/api/v1/activity/likes", { activity: this.props.id }).then((data) => {
            if(!data.success)
                return;

            this.setState({ likes: data.content });
        });

        if(!User.guest) {
            API.get("/api/v1/activity/like", { activity: this.props.id }).then((data) => {
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
    };

    onPrimaryLayout() {
        this.setState({ ready: true });
    };

    onLikePress() {
        if(!User.guest) {
            API.post("/api/v1/activity/like", { activity: this.props.id }).then((data) => {
                if(!data.success)
                    return;

                this.setState({ like: data.content });

                API.get("/api/v1/activity/likes", { activity: this.props.id }).then((data) => {
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

    onPlaybackPress(type) {
        this.setState({
            playback: type
        });
    };

    showProfile() {
        const modal = this.props.showModal("ProfilePage", { user: this.state.user.id });
    };

    hideModal(modal) {
        this.props.hideModal(modal);
    };

    onExportPress() {
        Linking.openURL(`${Settings.api}/api/v1/activity/export?id=${this.state.activity.id}`);
    };

    async onDelete() {
        await API.delete("/api/v1/activity", { activity: this.state.activity.id });

        this.page.current.onClose();
    };

    onCommentsPress() {
        if(User.guest && this.state?.comments?.length == 0)
            return this.props.showModal("LoginPage");

        return this.setState({ showComments: true });
    };

    render() {
        if(this.state?.recording == null || this.state?.user == null) {
            // add a placeholder layout
            return null;
        }

        return (
            <Page ref={this.page} visible={this.state?.ready} onClose={() => this.props.onClose()}>
                <Page.Header
                    title="Activity"
                    navigation="true"
                    onNavigationPress={() => this.page.current.onClose()}
                    />
                
                <ScrollView>
                    <View style={style.sheet.section}>
                        <Images height={style.sheet.map.height}>
                            <MapView
                                ref={this.mapView}
                                style={style.sheet.map}
                                customMapStyle={Appearance.theme.mapStyle || []}
                                provider={PROVIDER_GOOGLE}
                                onLayout={() => this.onLayout(this.mapView)}
                                onRegionChangeComplete={() => this.onPrimaryLayout()}
                                animation={false}
                                pitchEnabled={false}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                rotateEnabled={false}
                                onPress={() => !this.state.activity.outdated && this.onPlaybackPress("3d")}
                                >
                                {this.state.recording != null && 
                                    (this.state.recording.getMapCoordinates().map(section => (
                                        <Polyline key={section.index} coordinates={(Config.user?.mapMatching)?(section.coordinates.road ?? section.coordinates):(section.coordinates)} 
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
                                onLayout={() => this.onLayout(this.mapViewSatellite)}
                                pitchEnabled={false}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                rotateEnabled={false}
                                >
                                {this.state.recording != null && 
                                    (this.state.recording.getMapCoordinates().map(section => (
                                        <Polyline key={section.index} coordinates={section.coordinates} 
                                            strokeColor={Appearance.theme.colorPalette.route}
                                            strokeWidth={3}
                                            lineJoin={"round"}
                                        ></Polyline>
                                    )))
                                }
                            </MapView>
                        </Images>

                        {(this.state?.activity?.outdated) && (
                            <View style={{ marginVertical: 6 }}>
                                <Text style={style.sheet.title}>Playback unavailable</Text>
                                <Text style={style.sheet.description}>This activity was recorded with outdated accuracy settings</Text>
                            </View>
                        )}

                        <TouchableOpacity style={style.sheet.user} onPress={() => this.showProfile()}>
                            <View>
                                <Image
                                    style={style.sheet.user.image}
                                    source={{
                                        uri: this.state.user.avatar
                                    }}
                                />
                            </View>

                            <View style={style.sheet.user.texts}>
                                <Text style={style.sheet.user.texts.title}>{this.state.user.name}</Text>
                            <Text style={style.sheet.user.texts.description}>{moment(this.state.activity.timestamp).fromNow()}{(this.state?.stats?.origin) && (" in " + this.state.stats.origin)}{(this.state?.stats?.destination && this.state?.stats?.destination != this.state?.stats?.origin) && (" to " + this.state.stats.destination)}</Text>
                            </View>
                            
                            <TouchableOpacity style={style.sheet.buttons.button} onPress={() => this.onSharePress()}>
                                <FontAwesome5 style={[ style.sheet.buttons.button.icon, { marginLeft: 6 } ]} name={"share-square"}/>
                            </TouchableOpacity>
                        </TouchableOpacity>

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
                    </View>

                    {this.state.activity.bike && (
                        <Bike.Compact style={style.sheet.section} id={this.state.activity.bike} onPress={() => this.props.showNotification("This feature is not implemented yet!")}/>
                    )}

                    {this.state?.comments && (
                        <TouchableOpacity style={[ style.sheet.comments, style.sheet.section, style.sheet.section.padded ]} onPress={() => this.onCommentsPress()}>
                            <Text style={style.sheet.section.header}>Comments <Text style={style.sheet.section.header.count}>({this.state?.comments.length})</Text></Text>
                        
                            {this.state?.comments.length?(
                                <View style={style.sheet.comments.snippet}>
                                    <Image
                                        style={style.sheet.comments.snippet.image}
                                        source={{
                                            uri: this.state.comments[0].user.avatar
                                        }}
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
                                (User.guest)?(
                                    <View style={style.sheet.comments.write}>
                                        <View style={style.sheet.comments.write.avatar}>
                                            <Image
                                                style={style.sheet.comments.write.avatar.image}
                                                source={{
                                                    uri: Settings.api + "/avatars/default.jpg"
                                                }}
                                            />
                                        </View>
    
                                        <View style={style.sheet.comments.write.content}>
                                            <Text style={style.sheet.comments.write.content.text}>Login to leave a comment...</Text>
                                        </View>
                                    </View>
                                ):(
                                    <View style={style.sheet.comments.write}>
                                        <View style={style.sheet.comments.write.avatar}>
                                            <Image
                                                style={style.sheet.comments.write.avatar.image}
                                                source={{
                                                    uri: User.data?.avatar
                                                }}
                                            />
                                        </View>
    
                                        <View style={style.sheet.comments.write.content}>
                                            <Text style={style.sheet.comments.write.content.text}>Leave a comment...</Text>
                                        </View>
                                    </View>
                                )
                            )}
                        </TouchableOpacity>
                    )}
                        
                    <View style={style.sheet.section}>
                        <View style={style.sheet.buttons}>
                            <TouchableOpacity style={style.sheet.buttons.button} onPress={() => this.onLikePress()}>
                                <FontAwesome5 style={style.sheet.buttons.button.icon} name={"heart"} solid={this.state?.like}/>
                                
                                {this.state?.likes > 0 && (
                                    <Text style={style.sheet.buttons.button.label}>{this.state.likes}</Text>
                                )}
                            </TouchableOpacity>

                            {/*<TouchableOpacity style={style.sheet.buttons.button} onPress={() => this.onPlaybackPress()}>
                                <FontAwesome5 style={style.sheet.buttons.button.icon} name={"play"}/>
                                
                                <Text style={style.sheet.buttons.button.label}>3D</Text>
                            </TouchableOpacity>*/}

                            <View style={style.sheet.buttons.author}>
                                {(!this.state.activity.outdated) && (
                                    <TouchableOpacity style={style.sheet.buttons.button} onPress={() => this.onPlaybackPress("2d")}>
                                        <FontAwesome5 style={style.sheet.buttons.button.icon} name={"play"}/>
                                        
                                        <Text style={style.sheet.buttons.button.label}>2D</Text>
                                    </TouchableOpacity>
                                )}

                                {this.state.user.id == User.id && (
                                    <TouchableOpacity style={style.sheet.buttons.export} onPress={() => this.onExportPress()}>
                                        <Text style={style.sheet.buttons.export.icon}>Export</Text>
                                        <Text style={style.sheet.buttons.export.label}>as GPX</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            

                            { this.state.user.id == User.id && false == true && (
                                <TouchableOpacity style={[ style.sheet.buttons.button, { justifyContent: "flex-end" } ]}>
                                    <FontAwesome5 style={[ style.sheet.buttons.button.icon ]} name={"ellipsis-h"}/>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View style={style.sheet.section}>
                        <Text style={[ style.sheet.section.header, style.sheet.section.padded ]}>Elevation Gain</Text>
                        
                        <ActivityElevation
                            activity={this.props.id}
                            width={"100%"}
                            height={140}
                            />
                    </View>

                    <View style={style.sheet.section}>
                        <Text style={[ style.sheet.section.header, style.sheet.section.padded ]}>Speed</Text>
                        
                        <ActivitySpeed
                            activity={this.props.id}
                            width={"100%"}
                            height={140}
                            />
                    </View>

                    {(this.state?.activity?.user == User.id) && (
                        <Form>
                            <Form.Button title="Delete Activity" confirm={{
                                message: "Do you really want to delete this activity? This cannot be undone! You can instead choose to hide it from everyone if you wish."
                            }} onPress={() => this.onDelete()}/>
                        </Form>
                    )}
                </ScrollView>

                {this.state?.showComments && (
                    <ActivityComments activity={this.props.id} onClose={() => this.setState({ showComments: false })} showModal={(...args) => this.props.showModal(...args)} hideModal={(...args) => this.props.hideModal(...args)}/>
                )}

                {this.state?.playback && (
                    <ActivityPlayback type={this.state.playback} activity={this.props.id} onClose={() => this.setState({ playback: false })}/>
                )}
            </Page>
        );
    }
};
