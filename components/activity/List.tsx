import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../utils/themes";
import { ParagraphText } from "../texts/Paragraph";
import { timeSince } from "../../utils/time";
import ActivityMap from "../../layouts/activity/map";
import { ComponentType } from "../../models/componentType";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GetActivityResponse, getActivityById } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../modules/useClient";
import { BikeActivitySummary } from "../BikeActivitySummary";

type ActivityListProps = {
    id: string | null;
    style?: ViewStyle;
};

export default function ActivityList({ id, style }: ActivityListProps) {
    const client = useClient();
    const router = useRouter();
    const theme = useTheme();

    const [ activity, setActivity ] = useState<GetActivityResponse["activity"]>(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(client, id).then((result) => result.success && setActivity(result.activity));
    }, []);

    return (
        <View style={style}>
            <View style={{ flexDirection: "row", height: 80, gap: 10 }}>
                <TouchableOpacity disabled={activity === null} onPress={() => router.push(`/activities/${id}`)} style={{ width: 140 }}>
                    <ActivityMap activity={activity} type={ComponentType.ListItem}/>
                </TouchableOpacity>

                <View style={{
                    flex: 1,
                    paddingVertical: 2,
                    justifyContent: "space-around",
                    gap: 5
                }}>

                    {(activity)?(
                        <React.Fragment>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ParagraphText>{timeSince(activity.timestamp)} {(activity?.finishArea) && (`in ${activity.finishArea}`)}</ParagraphText>
                            </View>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                {activity.summary.filter((summary) => summary.key === "average_speed" || summary.key === "distance" || summary.key === "elevation").slice(0, 3).map((summary) => (
                                    <BikeActivitySummary key={summary.key} type={summary.key} value={summary.value} color={theme.color}/>
                                ))}
                            </View>
                        </React.Fragment>
                    ):(
                        <React.Fragment>
                            <View style={{
                                height: 16,

                                flexGrow: 1,

                                backgroundColor: theme.placeholder
                            }}/>

                            <View style={{
                                height: 16,

                                flexGrow: 1,

                                backgroundColor: theme.placeholder
                            }}/>
                        </React.Fragment>
                    )}
                </View>
            </View>
        </View>
    );
}
