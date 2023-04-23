import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import { getActivityById, getActivitySummaryById } from "../../../../../models/activity";
import Activity from "../../../../../layouts/activity";
import Bike from "../../../../../components/bike";
import { useThemeConfig } from "../../../../../utils/themes";
import { useSelector } from "react-redux";
import { HeaderText } from "../../../../../components/texts/header";
import { ParagraphText } from "../../../../../components/texts/paragraph";

export default function ActivityPage({ params }) {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);
    
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
        <View style={{ flex: 1, backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Activity" }} />

            <ScrollView style={{ padding: 10 }}>
                <View style={{ height: 200 }}>
                    <Activity.Map activity={activity} compact={false}/>
                </View>

                <Activity.Author activity={activity}/>

                <Activity.Stats activity={activity}/>

                {(activity)?(
                    (activity.bike) && (
                        <TouchableOpacity onPress={() => router.push(`/bike/${activity.bike}`)}>
                            <Bike data={activity.bike} style={{ marginVertical: 10 }}/>
                        </TouchableOpacity>
                    )
                ):(
                    <Bike style={{ marginVertical: 10 }}/>
                )}
            </ScrollView>

            <View style={{
                marginBottom: 20,
                padding: 10,
                paddingTop: 5
            }}>
                <TouchableOpacity onPress={() => router.push(`/activities/${id}/comments`)} style={{ gap: 10 }}>
                    <HeaderText>Comments {(activity?.summary) && (<Text style={{ fontWeight: "normal" }}>({activity.comments})</Text>)}</HeaderText>

                    <Activity.Comment comment={activity?.comment}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};
