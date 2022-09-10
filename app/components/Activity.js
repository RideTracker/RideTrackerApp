import React from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import Constants from 'expo-constants';

import Button from "../components/Button";

import TimestampHelper from "../helpers/TimestampHelper";

import API from "../API";

const styles = StyleSheet.create({
    activity: {
        map: {
            height: 300,

            position: "relative",
    
            image: {
                width: "100%",
                height: "100%"
            },

            content: {
                position: "absolute",

                flex: 1,
                flexDirection: "row",
                
                bottom: 0,

                width: "100%",

                padding: 12,

                backgroundColor: "rgba(0, 0, 0, .8)",
    
                image: {
                    width: 40,
                    height: 40,
    
                    borderRadius: 50,

                    backgroundColor: "#000",

                    marginRight: 12
                },

                texts: {
                    flex: 1,
                    flexDirection: "column",

                    justifyContent: "center",

                    title: {
                        color: "#FFF",
    
                        fontWeight: "bold",
                        fontSize: 18
                    },
    
                    description: {
                        color: "#F1F1F1",
    
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
                    color: "#FFF",

                    fontWeight: "bold",
                    fontSize: 26
                },

                description: {
                    color: "#F1F1F1",

                    fontSize: 16
                }
            }
        }
    }
});

export default class Activity extends React.Component {
    ready = false;
    data = {};

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
                    <Image
                        style={styles.activity.map.image}
                        source={{
                            uri: `https://ride-tracker.nora-soderlund.se/users/${this.user.slug}/route.png`
                        }}
                    />

                    <View style={styles.activity.map.content}>
                        <View>
                            <Image
                                style={styles.activity.map.content.image}
                                source={{
                                    uri: `https://ride-tracker.nora-soderlund.se/users/${this.user.slug}/avatar.png`
                                }}
                            />
                        </View>

                        <View style={styles.activity.map.content.texts}>
                            <Text style={styles.activity.map.content.texts.title}>{this.user.name}</Text>
                            <Text style={styles.activity.map.content.texts.description}>{TimestampHelper.getTimeAgo(new Date(this.data.timestamp))} ago in Vänersborg</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.activity.stats}>
                    {this.summary.map((summary) => (
                        <View style={styles.activity.stats.item}>
                            <Text style={styles.activity.stats.item.title}>{summary.value}</Text>
                            <Text style={styles.activity.stats.item.description}>{summary.key}</Text>
                        </View>
                    ))}
                </View>
                
                <Button title="Show more details"/>
            </View>
        );
    }
};
