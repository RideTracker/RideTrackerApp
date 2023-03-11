import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useThemeConfig } from "../../utils/themes";
import { ActivityResponse } from "../../models/activity";
import { timeSince } from "../../utils/time";
import { useSelector } from "react-redux";

type ActivityCommentProps = {
    style?: any;
    activity?: ActivityResponse;
};

export default function ActivityComment({ style, activity }: ActivityCommentProps) {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);
    
    return (
        <View style={style}>
            <View style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                gap: 10
            }}>
                {(activity)?(
                    <Image
                        style={{
                            width: 40,
                            aspectRatio: 1,
                            borderRadius: 40,
                            overflow: "hidden"
                        }}
                        source={{
                            uri: (activity.comment)?(activity.comment.user.avatar):(userData.user?.avatar)
                        }}/>
                ):(
                    <View style={{
                        width: 40,
                        aspectRatio: 1,
                        borderRadius: 40,
                        overflow: "hidden",
                        backgroundColor: themeConfig.placeholder
                    }}/>
                )}

                <View style={{ gap: 5, justifyContent: "center" }}>
                    {(activity.comment) && (
                        <View style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 5
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: "bold",

                                color: (activity)?(themeConfig.color):("transparent"),
                                backgroundColor: (activity)?("transparent"):(themeConfig.placeholder)
                            }}>
                                {(activity)?(
                                    (activity.comment)?(activity.comment.user.name):(userData.user?.name)
                                ):("Firstname lastname")}
                            </Text>
                            
                            <Text style={{ color: themeConfig.color }}>
                                {(activity?.comment) && timeSince(activity.comment.timestamp)}
                            </Text>
                        </View>
                    )}

                    <Text style={{
                        fontSize: 17,

                        color: (activity)?(themeConfig.color):("transparent"),
                        backgroundColor: (activity)?("transparent"):(themeConfig.placeholder)
                    }}>
                        {(activity)?(
                            (activity.comment)?(activity.comment.message):("There's no comments, be the first one!")
                        ):("This is a comment!")}
                    </Text>
                </View>
            </View>
        </View>
    );
};
