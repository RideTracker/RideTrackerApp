import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { getActivityById } from "../../models/activity";
import Error from "../error";
import { useSelector } from "react-redux";
import ActivityMap from "../../layouts/activity/map";
import ActivityMapStats from "../../layouts/activity/mapStats";
import ActivityAuthor from "../../layouts/activity/author";

type ActivityCompactProps = {
    id: string | null;
    style?: any;
};

export default function ActivityCompact({ id, style }: ActivityCompactProps) {
    const userData = useSelector((state: any) => state.userData);

    const router = useRouter();

    const [ activity, setActivity ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(userData.key, id).then((result) => result.success && setActivity(result.activity));
    }, []);

    return (
        <View style={style}>
            <TouchableOpacity disabled={activity === null} onPress={() => router.push(`/activities/${id}`)} style={{ height: 200 }}>
                <ActivityMap activity={activity} compact={true}>
                    <ActivityMapStats activity={activity}/>
                </ActivityMap>
            </TouchableOpacity>

            <ActivityAuthor activity={activity}/>
        </View>
    );
};
