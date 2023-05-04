import { useState, useEffect, useRef } from "react";
import { Alert, LayoutRectangle, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import ActivityCompact from "../../../../components/activity/compact";
import { useTheme } from "../../../../utils/themes";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import { RECORDINGS_PATH } from "./record";
import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { ParagraphText } from "../../../../components/texts/paragraph";
import { LinkText } from "../../../../components/texts/link";
import { ScrollViewFilter } from "../../../../components/ScrollViewFilter";
import { useUser } from "../../../../modules/user/useUser";
import { CaptionText } from "../../../../components/texts/caption";
import { getFeed } from "../../../../controllers/feed/getFeed";

export default function Index() {
    const userData = useUser();
    const theme = useTheme();

    const router = useRouter();

    const scrollViewRef = useRef<ScrollView>();
   
    const [ feed, setFeed ] = useState(null);
    const [ refreshing, setRefreshing ] = useState(true);
    const [ recordings, setRecordings ] = useState(null);
    const [ filterText, setFilterText ] = useState<string>("");
    const [ filterLayout, setFilterLayout ] = useState<LayoutRectangle>(null);

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
            if(!filterText.length)
                scrollViewRef.current.scrollTo({ x: 0, y: filterLayout?.height ?? 0 });

            return;
        }

        getFeed(userData.key, { ...userData.filters?.feed, search: filterText }).then((result) => {
            setRefreshing(false);
            setFeed(result);
        });
    }, [ refreshing ]);

    useEffect(() => {
        scrollViewRef.current.scrollTo({ x: 0, y: 0 });

        setRefreshing(true);
    }, [ userData.filters?.feed, filterText ]);

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background }}>
            <Stack.Screen options={{
                headerRight: () => (
                    <View style={{ marginRight: 20 }}>
                        <TouchableOpacity>
                            <FontAwesome name="bell" size={24} color={theme.color}/>
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
                            tintColor={theme.contrast}
                            refreshing={refreshing}
                            onRefresh={() => !refreshing && setRefreshing(true)}
                            />
                    }
                    contentOffset={{
                        x: 0,
                        y: filterLayout?.height ?? 0
                    }}
                >
                    <ScrollViewFilter type="feed" onChange={(text) => setFilterText(text)} onLayout={(event) => setFilterLayout(event.nativeEvent.layout)}/>

                    <View style={{ padding: 10 }}>
                        {(feed)?(
                            (feed.success)?(
                                (feed.activities.length)?(
                                    <View style={{ gap: 10 }}>
                                        {(feed.activities.map((activity) => activity?.id && (
                                            <ActivityCompact key={activity.id} id={activity.id}/>
                                        )))}
                                    </View>
                                ):(
                                    <CaptionText style={{ padding: 10, textAlign: "center" }}>There's nothing here!</CaptionText>
                                )
                            ):(
                                <CaptionText style={{ padding: 10, textAlign: "center" }}>Something went wrong!</CaptionText>
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
                            <FontAwesome name="warning" size={24} color={theme.color}/>

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
