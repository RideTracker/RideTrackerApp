import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import { getActivityById } from "../../../models/activity";
import Activity from "../../../layouts/activity";
import Bike from "../../../components/bike";

export default function ActivityPage({ params }) {
    const router = useRouter();
    const { id } = useSearchParams();

    const [ activity, setActivity ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(id as string).then((result) => setActivity(result));
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <Stack.Screen options={{ title: "Activity" }} />

            <ScrollView style={{ padding: 10 }}>
                <Activity.Map activity={activity} compact={false}/>

                <Activity.Author activity={activity}/>

                <Activity.Stats activity={activity}/>

                {(activity)?(
                    (activity.bike) && (
                        <TouchableOpacity onPress={() => router.push(`/bike/${activity.bike}`)}>
                            <Bike id={activity.bike} style={{ marginVertical: 10 }}/>
                        </TouchableOpacity>
                    )
                ):(
                    <Bike id={null} style={{ marginVertical: 10 }}/>
                )}

                <View style={{
                    marginVertical: 20,
                    gap: 10
                }}>
                    <Text style={{ fontSize: 20 }}><Text style={{ fontWeight: "bold" }}>Comments</Text> (11)</Text>

                    <TouchableOpacity onPress={() => router.push(`/activities/${id}/comments`)}>
                        <Activity.Comment/>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};
