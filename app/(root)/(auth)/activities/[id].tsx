import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import { getActivityById } from "../../../../models/activity";
import Activity from "../../../../layouts/activity";
import Bike from "../../../../components/bike";
import { useThemeConfig } from "../../../../utils/themes";
import { useSelector } from "react-redux";
import { HeaderText } from "../../../../components/texts/header";
import { ParagraphText } from "../../../../components/texts/paragraph";

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
                marginBottom: 10,
                gap: 10,
                padding: 10,
                paddingTop: 5
            }}>
                <HeaderText>Comments {(activity?.summary) && (<Text style={{ fontWeight: "normal" }}>({activity.summary.comments})</Text>)}</HeaderText>

                <TouchableOpacity onPress={() => router.push(`/activities/${id}/comments`)}>
                    <Activity.Comment activity={activity}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};
