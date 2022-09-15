import React, { useRef } from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import Constants from 'expo-constants';

import Button from "../components/Button";
import WebView from 'react-native-webview';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import TimestampHelper from "../helpers/TimestampHelper";

import Map from "../components/Map.json";

import API from "../API";
import Config from "../config.json";
import RecordingData from "../data/RecordingData";

const styles = StyleSheet.create({
    activity: {
        marginTop: 12,

        backgroundColor: Config.colorPalette.section,
        
        borderBottomWidth: 1,
        borderBottomColor: Config.colorPalette.border,
        
        borderTopWidth: 1,
        borderTopColor: Config.colorPalette.border,

        map: {
            height: 300,

            position: "relative",
    
            image: {
                width: "100%",
                height: "100%"
            },

            user: {
                position: "absolute",

                flex: 1,
                flexDirection: "row",
                
                bottom: 0,

                width: "100%",

                padding: 12,

                backgroundColor: "rgba(28, 28, 28, 1)",
    
                image: {
                    width: 40,
                    height: 40,
    
                    borderRadius: 50,

                    marginRight: 12
                },

                texts: {
                    flex: 1,
                    flexDirection: "column",

                    justifyContent: "center",

                    title: {
                        color: Config.colorPalette.highlight,
    
                        fontWeight: "bold",
                        fontSize: 18
                    },
    
                    description: {
                        color: Config.colorPalette.foreground,
    
                        fontSize: 16
                    }
                }
            }
        },
        
        stats: {
            position: "relative",

            marginTop: 12,

            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",

            item: {
                width: "50%",
                height: 80,

                justifyContent: "center",
                alignItems: "center",

                title: {
                    color: Config.colorPalette.highlight,

                    fontWeight: "bold",
                    fontSize: 26
                },

                description: {
                    color: Config.colorPalette.foreground,

                    fontSize: 16
                }
            }
        }
    }
});

export default class Activity extends React.Component {
    ready = false;
    data = {};

    constructor(props) {
        super(props);

        this.mapView = React.createRef();
    }

    componentDidMount() {
        // pls do a API.get([])
        API.get("activity", {
            id: this.props.id
        }).then((data) => {
            this.data = data.content;

            API.get("activity/summary", {
                id: this.props.id
            }).then((data) => {
                this.summary = data.content;
    
                API.get("user", {
                    id: this.data.user
                }).then((data) => {
                    this.ready = true;
                    this.user = data.content;
        
                    this.setState({});
                });
            });
        });

        API.get("rides/" + this.props.id + ".json").then(data => {
            this.setState({
                recording: new RecordingData(data)
            });
        });
    };

    onLayout() {
        this.mapView.current.fitToCoordinates(this.state.recording.getAllLatLngCoordinates(), {
            edgePadding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            animated: false
        });
    };

    render() {
        if(!this.ready) {
            // add a placeholder layout
            return (
                <Text>Loading...</Text>
            );
        }

        return (
            <View style={styles.activity}>
                <View style={styles.activity.map}>
                    <MapView ref={this.mapView} style={styles.activity.map.image} customMapStyle={Config.mapStyle} provider={PROVIDER_GOOGLE} onLayout={() => this.onLayout()}>
                        {this.state.recording != null && 
                            (this.state.recording.getLatLngCoordinates().map(section => (
                                <Polyline key={section.index} coordinates={section.coordinates} 
                                    strokeColor={"#FFF"}
                                    strokeWidth={3}
                                    lineJoin={"round"}
                                ></Polyline>
                            )))
                        }
                    </MapView>

                    <View style={styles.activity.map.user}>
                        <View>
                            <Image
                                style={styles.activity.map.user.image}
                                source={{
                                    uri: `https://ride-tracker.nora-soderlund.se/users/${this.user.slug}/avatar.png`
                                }}
                            />
                        </View>

                        <View style={styles.activity.map.user.texts}>
                            <Text style={styles.activity.map.user.texts.title}>{this.user.name}</Text>
                            <Text style={styles.activity.map.user.texts.description}>{TimestampHelper.getTimeAgo(new Date(this.data.timestamp))} ago in Vänersborg</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.activity.stats}>
                    {this.summary.map((summary) => (
                        <View key={summary.key} style={styles.activity.stats.item}>
                            <Text style={styles.activity.stats.item.title}>{summary.value}</Text>
                            <Text style={styles.activity.stats.item.description}>{summary.key}</Text>
                        </View>
                    ))}
                </View>
                
                { this.props.onPress != undefined &&
                    <Button title="Show more details" onPress={() => this.props.onPress(this.data.id)}/>
                }
            </View>
        );
    }
};
