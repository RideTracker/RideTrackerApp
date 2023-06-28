import { useState, useEffect, useRef, Ref } from "react";
import { LayoutRectangle, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import ActivityCompact from "../../../../components/activity/Compact";
import { useTheme } from "../../../../utils/themes";
import * as FileSystem from "expo-file-system";
import { RECORDINGS_PATH } from "./record";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import { LinkText } from "../../../../components/texts/Link";
import { ScrollViewFilter } from "../../../../components/ScrollViewFilter";
import { useUser } from "../../../../modules/user/useUser";
import { Pagination } from "../../../../components/Pagination";
import { getFeed } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../modules/useClient";
import useInternetConnection from "../../../../modules/useInternetConnection";
import { CaptionText } from "../../../../components/texts/Caption";
import OfflinePageOverlay from "../../../../components/OfflinePageOverlay";

export default function Index() {
    const userData = useUser();
    const client = useClient();
    const theme = useTheme();
    const router = useRouter();
    const internetConnection = useInternetConnection();

    const scrollViewRef = useRef<ScrollView>();

    const [ items, setItems ] = useState<string[]>([]);
    const [ recordings, setRecordings ] = useState(null);
    const [ filterText, setFilterText ] = useState<string>("");
    const [ filterLayout, setFilterLayout ] = useState<LayoutRectangle>(null);

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
        }

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
        handlePagination(true);
    }, [ userData.filters?.feed, filterText ]);

    const handlePagination = async (reset: boolean) => {
        const order = userData.filters?.feed?.find((item) => item.key === "order")?.value;
        const timeline = userData.filters?.feed?.find((item) => item.key === "timeline")?.value;

        const result = await getFeed(client, (!reset)?(items.length):(0), filterText, order, timeline);

        if(!result.success)
            return false;

        if(reset) {
            if(!filterText.length && !userData.filters?.feed?.length && scrollViewRef.current)
                scrollViewRef.current.scrollTo({ x: 0, y: (filterLayout?.height ?? 0) + 10 });
            
            setItems(result.activities.map((activity) => activity.id));
        }
        else
            setItems(items.concat(result.activities.map((activity) => activity.id)));

        return (result.activities.length === 5);
    };

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
                <Pagination style={{ padding: 10 }} scrollViewRef={scrollViewRef} paginate={handlePagination} items={items}
                // TODO: some activities here are undefined, why?
                    render={((activity) => (
                        <ActivityCompact key={activity} id={activity}/>
                    ))}
                    renderPlaceholder={(() => (
                        <ActivityCompact id={null}/>
                    ))}
                    contentOffset={{
                        x: 0,
                        y: (!filterText.length && !userData.filters?.feed?.length)?((filterLayout?.height ?? 0) + 10):(0)
                    }}>
                    <ScrollViewFilter type="feed" onChange={(text) => setFilterText(text)} onLayout={(event) => setFilterLayout(event.nativeEvent.layout)}/>
                </Pagination>

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

            {(internetConnection === "OFFLINE") && (
                <OfflinePageOverlay/>
            )}
        </View>
    );
}
