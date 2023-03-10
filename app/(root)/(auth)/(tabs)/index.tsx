import { useState, useEffect } from "react";
import { RefreshControl, ScrollView, Text, View, useColorScheme } from "react-native";
import { getFeed } from "../../../../models/feed";
import Error from "../../../../components/error";
import Empty from "../../../../components/empty";
import ActivityCompact from "../../../../components/activity/compact";
import { useThemeConfig } from "../../../../utils/themes";
import { useSelector } from "react-redux";

export default function Index() {
    const userData = useSelector((state: any) => state.userData);
    const themeConfig = useThemeConfig();
   
    const [ feed, setFeed ] = useState(null);
    const [ refreshing, setRefreshing ] = useState(true);

    useEffect(() => {
        if(!refreshing)
            return;

        getFeed(userData.key).then((result) => {
            setRefreshing(false);
            setFeed(result);
        });
    }, [ refreshing ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: themeConfig.background }}>
            <View style={{
                flex: 1
            }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            tintColor={themeConfig.contrast}
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
        </View>
    );
};
