import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Error from "../error";
import { useSelector } from "react-redux";
import { CaptionText } from "../texts/caption";
import { useTheme } from "../../utils/themes";
import { ParagraphText } from "../texts/paragraph";
import { timeSince } from "../../utils/time";
import ActivityAuthor from "../../layouts/activity/author";
import ActivityMap from "../../layouts/activity/map";
import { ComponentType } from "../../models/componentType";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useUser } from "../../modules/user/useUser";
import { getActivityById } from "../../controllers/activities/getActivityById";

type ActivityListProps = {
    id: string | null;
    style?: any;
};

export default function ActivityList({ id, style }: ActivityListProps) {
    const userData = useUser();

    const router = useRouter();
    const theme = useTheme();

    const [ activity, setActivity ] = useState(null);

    useEffect(() => {
        if(id !== null)
            getActivityById(userData.key, id).then((result) => result.success && setActivity(result.activity));
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
                        paddingLeft: 10,
                        justifyContent: "space-around",
                        gap: 5
                    }}>

                    {(activity)?(
                        <React.Fragment>
                            {(activity.summary) && (
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
                            )}
                            
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ParagraphText>{timeSince(activity.timestamp)} {(activity.summary?.startArea) && (`in ${activity.summary.startArea}`)}</ParagraphText>
                                
                                <TouchableOpacity style={{
                                    width: 30,
                                    height: 30,

                                    marginLeft: "auto",

                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <FontAwesome name="ellipsis-v" size={24} color={theme.color} />
                                </TouchableOpacity>
                            </View>
                        </React.Fragment>
                    ):(
                        <View style={{
                            height: 16,

                            flexGrow: 1,

                            backgroundColor: theme.placeholder
                        }}/>
                    )}
                </View>
            </View>
        </View>
    );
};
