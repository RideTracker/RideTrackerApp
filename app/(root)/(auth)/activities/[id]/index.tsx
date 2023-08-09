import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import Bike from "../../../../../components/Bike";
import { useTheme } from "../../../../../utils/themes";
import ActivityMap from "../../../../../layouts/activity/map";
import ActivityAuthor from "../../../../../layouts/activity/author";
import ActivityStats from "../../../../../layouts/activity/stats";
import { ComponentType } from "../../../../../models/componentType";
import ActivityCommentsSummary from "../../../../../components/ActivityCommentsSummary";
import ActivityRoute from "../../../../../components/ActivityRoute";
import { useClient } from "../../../../../modules/useClient";
import { GetActivityResponse, getActivityById } from "@ridetracker/ridetrackerclient";
import OfflinePageOverlay from "../../../../../components/OfflinePageOverlay";
import useInternetConnection from "../../../../../modules/useInternetConnection";
import { useUser } from "../../../../../modules/user/useUser";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { CaptionText } from "../../../../../components/texts/Caption";
import { ParagraphText } from "../../../../../components/texts/Paragraph";
import ActivityMapDetails from "../../../../../components/ActivityMapDetails";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityInsights from "../../../../../components/activity/ActivityInsights";

export default function ActivityPage() {
    const client = useClient();
    const theme = useTheme();
    const router = useRouter();
    const { id } = useSearchParams();
    const internetConnection = useInternetConnection();
    const userData = useUser();

    const [ activity, setActivity ] = useState<GetActivityResponse["activity"]>(null);
    const [ deleted, setDeleted ] = useState<boolean>(false);

    useEffect(() => {
        if(id !== null) {
            getActivityById(client, id as string).then((result) => {
                if(result.success)
                    setActivity(result.activity);
                else if(result.deleted)
                    setDeleted(true);
            });
        }
    }, []);

    return (
        <View style={{flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Activity",
                headerRight: (activity?.user?.id === userData.user?.id)?(() => (
                    <TouchableOpacity onPress={() => router.push(`/activities/${id}/(index)/userDropdown`)}>
                        <Entypo name="dots-three-vertical" size={24} color={theme.color}/>
                    </TouchableOpacity>
                )):(undefined)
            }}/>

            {(!deleted)?(
                <SafeAreaView edges={[ "bottom" ]}>
                    <ScrollView>
                        <View style={{ gap: 20 }}>
                            <View style={{ padding: 10, gap: 20 }}>
                                <View>
                                    <View style={{ height: 200 }}>
                                        <ActivityMap activity={activity} type={ComponentType.Default}>
                                            <ActivityMapDetails activity={activity}/>
                                        </ActivityMap>
                                    </View>

                                    <ActivityAuthor activity={activity}/>

                                    <ActivityStats activity={activity}/>
                                </View>

                                <ActivityRoute activity={activity}/>

                                {(activity)?(
                                    (activity.bike) && (
                                        <TouchableOpacity onPress={() => router.push(`/bike/${activity.bike}`)}>
                                            <Bike id={activity.bike.id}/>
                                        </TouchableOpacity>
                                    )
                                ):(
                                    <Bike/>
                                )}

                                <ActivityCommentsSummary id={id as string}/>
                            </View>

                            <ActivityInsights activity={activity}/>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            ):(
                <View style={{
                    flex: 1,

                    justifyContent: "center",
                    alignItems: "center",
        
                    gap: 10,
                    padding: 10
                }}>
                    <FontAwesome5 name="trash" size={72} color={"grey"} style={{
                        alignSelf: "center"
                    }}/>
        
                    <CaptionText>This activity is deleted.</CaptionText>
        
                    <ParagraphText>It may take a while for the activity to be removed from everywhere.</ParagraphText>
                </View>
            )}

            {/*<View style={{
                marginBottom: 20,
                padding: 10,
                paddingTop: 5
            }}>
                <TouchableOpacity onPress={() => router.push(`/activities/${id}/comments`)} style={{ gap: 10 }}>
                    <HeaderText>Comments {(activity?.summary) && (<Text style={{ fontWeight: "normal" }}>({activity.comments})</Text>)}</HeaderText>

                    <ActivityComment comment={activity?.comment}/>
                </TouchableOpacity>
            </View>*/}

            {(internetConnection === "OFFLINE") && (
                <OfflinePageOverlay/>
            )}
        </View>
    );
}
