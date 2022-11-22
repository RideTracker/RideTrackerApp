import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import moment from "moment";

import ThemedComponent from "app/ThemedComponent";

import API from "app/Services/API";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Config from "app/Data/Config";
import Recording from "app/Data/Recording";

import { Section } from "app/Components";

import style from "./Compact.style";

export default class Compact extends ThemedComponent {
    style = style.update();

    ready = false;
    data = {};

    constructor(...args) {
        super(...args);

        this.mapView = React.createRef();
    }

    componentDidMount() {
        Cache.getActivity(this.props.id).then((activity) => {
            this.setState({ activity });

            Cache.getUser(activity.user).then((user) => {
                this.setState({ user });
            });
        });

        Cache.getActivityRide(this.props.id).then((ride) => {
            if(!ride)
                return;

            this.setState({ recording: new Recording(ride) });
        });

        API.get("/api/v1/activity/stats", { id: this.props.id }).then((stats) => {
            this.setState({ stats: stats.content });
        });
    };

    onLayout() {        
        this.mapView.current.fitToCoordinates(this.state.recording.getAllLatLngCoordinates(), {
            edgePadding: {
                top: 5,
                right: 5,
                bottom: 60,
                left: 5
            },
            animated: false
        });
    };

    render() {
        if(this.state?.recording == null || this.state?.user == null) {
            // add a placeholder layout
            return null;
        }

        return (
            <Section style={this.props?.style} onPress={() => this.props.onPress(this.state.activity.id)} allergicToOpacity>
                <View style={style.sheet.map}>
                    <MapView
                        ref={this.mapView}
                        style={style.sheet.map.view}
                        customMapStyle={[ ...Appearance.theme.mapStyle, ...Appearance.theme.mapStyleCompact ]}
                        provider={PROVIDER_GOOGLE}
                        onLayout={() => this.onLayout()}
                        pitchEnabled={false}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
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

                    {(this.state?.activity?.title) && (
                        <Text style={style.sheet.title}>{this.state.activity.title}</Text>
                    )}

                    {this.state?.stats && (
                        <View style={style.sheet.stats}>
                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>{this.state.stats.distance}
                                    <Text style={style.sheet.stats.item.unit}> km</Text>
                                </Text>
                                <Text style={style.sheet.stats.item.description}>distance</Text>
                            </View>

                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>{this.state.stats.speed}
                                    <Text style={style.sheet.stats.item.unit}> km/h</Text>
                                </Text>
                                <Text style={style.sheet.stats.item.description}>average speed</Text>
                            </View>

                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>{this.state.stats.elevation}
                                    <Text style={style.sheet.stats.item.unit}> m</Text>
                                </Text>
                                <Text style={style.sheet.stats.item.description}>elevation</Text>
                            </View>
                        </View>
                    )}
                </View>

                { (this.props?.showAuthor !== false)?(
                    <View style={style.sheet.user}>
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
                            <Text style={style.sheet.user.texts.description}>{moment(this.state.activity.timestamp).fromNow()}{(this.state?.stats?.origin != null) && (" in " + this.state.stats.origin)}{(this.state?.stats?.destination && this.state?.stats?.destination != this.state?.stats?.origin) && (" to " + this.state.stats.destination)}</Text>
                        </View>
                    </View>
                ):(
                    <View style={style.sheet.user}>
                        <View style={style.sheet.user.texts}>
                            <Text style={[ style.sheet.user.texts.description, { textAlign: "right" }]}>{moment(this.state.activity.timestamp).fromNow()}{(this.state?.stats?.origin) && (" in " + this.state.stats.origin)}{(this.state?.stats?.destination && this.state?.stats?.destination != this.state?.stats?.origin) && (" to " + this.state.stats.destination)}</Text>
                        </View>
                    </View>
                )}
            </Section>
        );
    }
};
