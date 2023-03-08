import { useState, useEffect } from "react";
import { Appearance, RefreshControl, ScrollView, Text, View } from "react-native";
import { Link, Stack } from "expo-router";
import { getFeed } from "../models/feed";
import Error from "../components/error";
import { StatusBar } from "expo-status-bar";
import Empty from "../components/empty";
import ActivityCompact from "./../components/activity/compact";

export default function Index() {
    const [ feed, setFeed ] = useState(null);
    const [ refreshing, setRefreshing ] = useState(true);

    useEffect(() => {
        if(!refreshing)
            return;

        getFeed().then((result) => {
            setRefreshing(false);
            setFeed(result);
        });
    }, [ refreshing ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFF" }}>
            <Stack.Screen options={{ title: "Feed" }} />

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => !refreshing && setRefreshing(true)}
                        />
                }
            >
                <View style={{ padding: 10 }}>
                    {(feed)?(
                        (!feed.error)?(
                            (feed.activities.length)?(
                                <View style={{ gap: 10 }}>
                                    {(feed.activities.map((id) => (
                                        <ActivityCompact key={id} id={id}/>
                                    )))}
                                </View>
                            ):(
                                <Empty>
                                    <Text>There's no activities published, be the first one to publish an activity!</Text>
                                </Empty>
                            )
                        ):(
                            <Error>
                                <Text>Failed to refresh the feed, please try again!</Text>
                            </Error>
                        )
                    ):(
                        <View style={{ gap: 10 }}>
                            {(Array(3).fill(null).map((_, index) => (
                                <ActivityCompact key={index} id={null}/>
                            )))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};
