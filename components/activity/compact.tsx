import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { getActivityById, ActivityResponse } from "../../models/activity";
import Error from "../error";
import Activity from "../../layouts/activity";

type ActivityCompactProps = {
    id: string | null;
    style?: any;
};

export default function ActivityCompact({ id, style }: ActivityCompactProps) {
    const router = useRouter();

    const [ activity, setActivity ]: [ ActivityResponse, any ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(id).then((result) => setActivity(result));
    }, []);


    if(activity && activity.error) {
        return (
            <Error>
                <Text>Failed to load the activity, try again!</Text>
            </Error>
        );
    };

    return (
        <View style={style}>
            <TouchableOpacity disabled={activity === null} onPress={() => router.push(`/activities/${id}`)}>
                <Activity.Map activity={activity} compact={true}>
                    <Activity.MapStats activity={activity}/>
                </Activity.Map>
            </TouchableOpacity>

            <Activity.Author activity={activity}/>
        </View>
    );
};
