import { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import ActivityMap from "../../layouts/activity/map";
import ActivityMapStats from "../../layouts/activity/mapStats";
import ActivityAuthor from "../../layouts/activity/author";
import { ComponentType } from "../../models/componentType";
import { getActivityById } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../modules/useClient";

type ActivityCompactProps = {
    id: string | null;
    style?: any;
};

export default function ActivityCompact({ id, style }: ActivityCompactProps) {
    const client = useClient();

    const router = useRouter();

    const [ activity, setActivity ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(client, id).then((result) => result.success && setActivity(result.activity));
    }, []);

    return (
        <View style={style}>
            <TouchableOpacity disabled={activity === null} onPress={() => router.push(`/activities/${id}`)} style={{ height: 200 }}>
                <ActivityMap activity={activity} type={ComponentType.Compact}>
                    <ActivityMapStats activity={activity}/>
                </ActivityMap>
            </TouchableOpacity>

            <ActivityAuthor activity={activity}/>
        </View>
    );
}
