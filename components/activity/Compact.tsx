import { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import ActivityMap from "../../layouts/activity/map";
import ActivityMapStats from "../../layouts/activity/mapStats";
import ActivityAuthor from "../../layouts/activity/author";
import { ComponentType } from "../../models/componentType";
import { useUser } from "../../modules/user/useUser";
import { getActivityById } from "../../controllers/activities/getActivityById";

type ActivityCompactProps = {
    id: string | null;
    style?: any;
};

export default function ActivityCompact({ id, style }: ActivityCompactProps) {
    const userData = useUser();

    const router = useRouter();

    const [ activity, setActivity ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(userData.key, id).then((result) => result.success && setActivity(result.activity));
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
};
