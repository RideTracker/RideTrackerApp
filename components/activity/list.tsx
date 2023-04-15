import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { getActivityById, ActivityResponse } from "../../models/activity";
import Error from "../error";
import Activity from "../../layouts/activity";
import { useSelector } from "react-redux";
import { CaptionText } from "../texts/caption";
import { useThemeConfig } from "../../utils/themes";
import { ParagraphText } from "../texts/paragraph";
import { timeSince } from "../../utils/time";
import ActivityAuthor from "../../layouts/activity/author";

type ActivityListProps = {
    id: string | null;
    style?: any;
};

export default function ActivityList({ id, style }: ActivityListProps) {
    const userData = useSelector((state: any) => state.userData);

    const router = useRouter();
    const themeConfig = useThemeConfig();

    const [ activity, setActivity ]: [ ActivityResponse, any ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(userData.key, id).then((result) => result.success && setActivity(result.activity));
    }, []);

    return (
        <View style={style}>
            <View style={{ flexDirection: "row", height: 80, gap: 10 }}>
                <TouchableOpacity disabled={activity === null} onPress={() => router.push(`/activities/${id}`)} style={{ width: 140 }}>
                    <Activity.Map activity={activity} compact={true}/>
                </TouchableOpacity>

                <View style={{
                        flex: 1,
                        paddingVertical: 2,
                        paddingHorizontal: 10,
                        justifyContent: "space-around",
                        gap: 5
                    }}>

                    {(activity)?(
                        (activity.summary) && (
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <View>
                                    <ParagraphText style={{ textAlign: "center", fontSize: 18 }}>{activity?.summary?.distance}</ParagraphText>
                                    <ParagraphText style={{ textAlign: "center" }}>distance</ParagraphText>
                                </View>

                                <View>
                                    <ParagraphText style={{ textAlign: "center", fontSize: 18 }}>{activity?.summary?.averageSpeed} km</ParagraphText>
                                    <ParagraphText style={{ textAlign: "center" }}>average speed</ParagraphText>
                                </View>

                                <View>
                                    <ParagraphText style={{ textAlign: "center", fontSize: 18 }}>{activity?.summary?.elevation} m</ParagraphText>
                                    <ParagraphText style={{ textAlign: "center" }}>elevation</ParagraphText>
                                </View>
                            </View>
                        )
                    ):(
                        <View style={{
                            height: 16,

                            flexGrow: 1,

                            backgroundColor: themeConfig.placeholder
                        }}/>
                    )}
                </View>
            </View>

            <ActivityAuthor activity={activity}/>
        </View>
    );
};
