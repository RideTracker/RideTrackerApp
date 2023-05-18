import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import Bike from "../../../../../components/Bike";
import { useTheme } from "../../../../../utils/themes";
import ActivityMap from "../../../../../layouts/activity/map";
import ActivityAuthor from "../../../../../layouts/activity/author";
import ActivityStats from "../../../../../layouts/activity/stats";
import { ComponentType } from "../../../../../models/componentType";
import { useUser } from "../../../../../modules/user/useUser";
import ActivityCommentsSummary from "../../../../../components/ActivityCommentsSummary";
import { getActivityById } from "../../../../../controllers/activities/getActivityById";
import { getActivitySummaryById } from "../../../../../controllers/activities/summary/getActivitySummaryById";
import ActivityRoute from "../../../../../components/ActivityRoute";

export default function ActivityPage({ params }) {
    const userData = useUser();

    const theme = useTheme();
    
    const router = useRouter();
    const { id } = useSearchParams();

    const [ activity, setActivity ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(userData.key, id as string).then((result) => setActivity(result.activity));
    }, []);

    useEffect(() => {
        if(activity && !activity.summary) {
            getActivitySummaryById(userData.key, activity.id).then((result) => {
                if(result.success)
                    setActivity({ ...activity, summary: result.activitySummary })
            });
        }
    }, [ activity ]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Activity" }} />

            <ScrollView style={{ padding: 10 }}>
                <View style={{ paddingBottom: 40}}>
                    <View style={{ height: 200 }}>
                        <ActivityMap activity={activity} type={ComponentType.Default}/>
                    </View>

                    <ActivityAuthor activity={activity}/>

                    <ActivityStats activity={activity}/>

                    <ActivityRoute activity={activity}/>

                    {(activity)?(
                        (activity.bike) && (
                            <TouchableOpacity onPress={() => router.push(`/bike/${activity.bike}`)}>
                                <Bike data={activity.bike} style={{ marginVertical: 10 }}/>
                            </TouchableOpacity>
                        )
                    ):(
                        <Bike style={{ marginVertical: 10 }}/>
                    )}

                    <ActivityCommentsSummary id={id as string}/>
                </View>
            </ScrollView>

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
        </View>
    );
};
