import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { getActivityById, ActivityResponse } from "../../models/activity";
import Error from "../error";
import Activity from "../../layouts/activity";
import { useSelector } from "react-redux";

type ActivityCompactProps = {
    id: string | null;
    style?: any;
};

export default function ActivityCompact({ id, style }: ActivityCompactProps) {
    const userData = useSelector((state: any) => state.userData);

    const router = useRouter();

    const [ activity, setActivity ]: [ ActivityResponse, any ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(userData.key, id).then((result) => result.success && setActivity(result.activity));
    }, []);

    return (
        <View style={style}>
            <TouchableOpacity disabled={activity === null} onPress={() => router.push(`/activities/${id}`)} style={{ height: 200 }}>
                <Activity.Map activity={activity} compact={true}>
                    <Activity.MapStats activity={activity}/>
                </Activity.Map>
            </TouchableOpacity>

            <Activity.Author activity={activity}/>
        </View>
    );
};
