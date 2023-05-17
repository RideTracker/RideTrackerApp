import { useState, useEffect, useRef } from "react";
import { Alert, LayoutRectangle, Platform, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import ActivityCompact from "../../../../components/activity/compact";
import { useTheme } from "../../../../utils/themes";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import { RECORDINGS_PATH } from "./record";
import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { ParagraphText } from "../../../../components/texts/paragraph";
import { LinkText } from "../../../../components/texts/link";
import { ScrollViewFilter } from "../../../../components/scrollViewFilter";
import { useUser } from "../../../../modules/user/useUser";
import { CaptionText } from "../../../../components/texts/caption";
import { getFeed } from "../../../../controllers/feed/getFeed";
import { Pagination } from "../../../../components/pagination";

export default function Index() {
    const userData = useUser();
    const theme = useTheme();

    const router = useRouter();

    const [ items, setItems ] = useState([]);
    const [ recordings, setRecordings ] = useState(null);
    const [ filterText, setFilterText ] = useState<string>("");
    const [ filterLayout, setFilterLayout ] = useState<LayoutRectangle>(null);

    async function paginate(reset: boolean) {
        const result = await getFeed(userData.key, items.length, { ...userData.filters?.feed, search: filterText });

        if(!result.success)
            return false;

        if(reset)
            setItems(result.activities);
        else
            setItems(items.concat(result.activities));

        return (result.activities.length === 5);
    };

    useEffect(() => {
        if(Platform.OS === "web")
            return;
            
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

    /*useEffect(() => {
        if(!refreshing) {
            if(!filterText.length)
                scrollViewRef.current.scrollTo({ x: 0, y: filterLayout?.height ?? 0 });

            return;
        }

        getFeed(userData.key, 0, { ...userData.filters?.feed, search: filterText }).then((result) => {
            setRefreshing(false);
            setFeed(result);
        });
    }, [ refreshing ]);*/

    useEffect(() => {
        //scrollViewRef.current.scrollTo({ x: 0, y: 0 });

        //setRefreshing(true);
        paginate(true);
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
                <Pagination style={{ padding: 10 }} paginate={paginate} items={items}
                // TODO: some activities here are undefined, why?
                render={((activity) => activity.id && (
                    <ActivityCompact key={activity.id} id={activity.id}/>
                ))}
                renderPlaceholder={(() => (
                    <ActivityCompact id={null}/>
                ))}
                contentOffset={{
                    x: 0,
                    y: (filterLayout?.height ?? 0) + 10
                }}>
                    <ScrollViewFilter type="feed" onChange={(text) => setFilterText(text)} onLayout={(event) => setFilterLayout(event.nativeEvent.layout)}/>
                </Pagination>

                <View style={{ padding: 10 }}>
                    {/*(feed)?(
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
                    )*/}
                </View>

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
