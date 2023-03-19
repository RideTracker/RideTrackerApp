import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useThemeConfig } from "../../utils/themes";
import { ActivityResponse } from "../../models/activity";
import { timeSince } from "../../utils/time";
import { useSelector } from "react-redux";
import { ParagraphText } from "../../components/texts/paragraph";
import { CaptionText } from "../../components/texts/caption";

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
                <View style={{
                    backgroundColor: themeConfig.placeholder,
                    width: 40,
                    aspectRatio: 1,
                    borderRadius: 40,
                    overflow: "hidden",
                }}>
                    {(activity) && (
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
                    )}
                </View>

                <View style={{ gap: 5, justifyContent: "center", flexGrow: 1 }}>
                    {(!activity || activity?.comment) && (
                        <View style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 5
                        }}>
                            <CaptionText style={(!activity) && {
                                color: "transparent",
                                backgroundColor: themeConfig.placeholder
                            }}>
                                {(activity)?(
                                    (activity.comment)?(activity.comment.user.name):(userData.user?.name)
                                ):("Firstname lastname")}
                            </CaptionText>
                            
                            <ParagraphText>
                                {(activity?.comment) && timeSince(activity.comment.timestamp)}
                            </ParagraphText>
                        </View>
                    )}

                    <ParagraphText style={{
                        paddingRight: 50,

                        ...((!activity)?({
                            color: "transparent",
                            backgroundColor: themeConfig.placeholder
                        }):({}))
                    }}>
                        {(activity)?(
                            (activity.comment)?(activity.comment.message):("There's no comments, you can be the first one!")
                        ):("This is a comment!")}
                    </ParagraphText>
                </View>
            </View>
        </View>
    );
};
