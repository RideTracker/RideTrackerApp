import { useState, useEffect, useRef } from "react";
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { getFeed } from "../../../../models/feed";
import Error from "../../../../components/error";
import Empty from "../../../../components/empty";
import ActivityCompact from "../../../../components/activity/compact";
import { useThemeConfig } from "../../../../utils/themes";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import { RECORDINGS_PATH } from "./record";
import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { ParagraphText } from "../../../../components/texts/paragraph";
import { LinkText } from "../../../../components/texts/link";
import { ScrollViewFilter } from "../../../../components/scrollViewFilter";

export default function Index() {
    const userData = useSelector((state: any) => state.userData);
    const themeConfig = useThemeConfig();

    const router = useRouter();

    const scrollViewRef = useRef();
   
    const [ feed, setFeed ] = useState(null);
    const [ refreshing, setRefreshing ] = useState(true);
    const [ recordings, setRecordings ] = useState(null);

    useEffect(() => {
        async function getRecordings() {
            const info = await FileSystem.getInfoAsync(RECORDINGS_PATH);

            if(!info.exists)
                return;

            const recordings = await FileSystem.readDirectoryAsync(RECORDINGS_PATH);

            if(!recordings.length)
                return;

            setRecordings(recordings);
        };

        getRecordings();
    }, []);

    useEffect(() => {
        if(!refreshing) {
            const scrollView = scrollViewRef.current as ScrollView;

            scrollView.scrollTo({ x: 0, y: 45 });

            return;
        }

        getFeed(userData.key).then((result) => {
            setRefreshing(false);
            setFeed(result);
        });
    }, [ refreshing ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{
                headerRight: () => (
                    <View style={{ marginRight: 20 }}>
                        <TouchableOpacity>
                            <FontAwesome name="bell" size={24} color={themeConfig.color}/>
                        </TouchableOpacity>
                    </View>
                )
            }}/>

            <View style={{
                flex: 1
            }}>
                <ScrollView
                    ref={scrollViewRef}
                    refreshControl={
                        <RefreshControl
                            tintColor={themeConfig.contrast}
                            refreshing={refreshing}
                            onRefresh={() => !refreshing && setRefreshing(true)}
                            />
                    }
                    contentOffset={{
                        x: 0,
                        y: 45
                    }}
                >
                    <ScrollViewFilter/>

                    <View style={{ padding: 10 }}>
                        {(feed)?(
                            (feed.success)?(
                                (feed.activities.length)?(
                                    <View style={{ gap: 10 }}>
                                        {(feed.activities.map((activity) => (
                                            <ActivityCompact key={activity.id} id={activity.id}/>
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

                {(recordings) && (
                    <TouchableOpacity style={{ padding: 20 }} onPress={() => router.push("/recordings")}>
                        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                            <FontAwesome name="warning" size={24} color={themeConfig.color}/>

                            <ParagraphText style={{ paddingRight: 20 + 24 }}>
                                You have {recordings.length} {(recordings.length > 1)?("recordings"):("recording")} that hasn't been uploaded. <LinkText>Take action.</LinkText>
                            </ParagraphText>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
