import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useTheme } from "../../utils/themes";
import { timeSince } from "../../utils/time";
import { useSelector } from "react-redux";
import { ParagraphText } from "../../components/texts/paragraph";
import { CaptionText } from "../../components/texts/caption";
import Constants from "expo-constants";
import { useUser } from "../../modules/user/useUser";
import { ComponentType } from "../../models/componentType";

type ActivityCommentProps = {
    style?: any;
    comment?: any;
    type: ComponentType;
};

export default function ActivityComment(props: ActivityCommentProps) {
    const { style, comment, type = ComponentType.Default } = props;

    const userData = useUser();

    const theme = useTheme();
    
    return (
        <View style={style}>
            <View style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                gap: 10
            }}>
                <View style={{
                    backgroundColor: theme.placeholder,
                    width: 40,
                    aspectRatio: 1,
                    borderRadius: 40,
                    overflow: "hidden",
                }}>
                    {(comment !== undefined) && (
                        <Image
                            style={{
                                width: 40,
                                aspectRatio: 1,
                                borderRadius: 40,
                                overflow: "hidden"
                            }}
                            source={{
                                uri: `${Constants.expoConfig.extra.images}/${(comment?.user)?(comment.user.avatar):(userData.user?.avatar)}/Avatar`
                            }}/>
                    )}
                </View>

                <View style={{ gap: 5, justifyContent: "center", flexGrow: 1 }}>
                    {(comment || comment === undefined) && (
                        <View style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 5
                        }}>
                            <CaptionText style={(comment === undefined) && {
                                color: "transparent",
                                backgroundColor: theme.placeholder
                            }}>
                                {(comment)?(
                                    (comment?.user)?(comment.user.name):(userData.user?.name)
                                ):((comment === undefined) && ("Firstname lastname"))}
                            </CaptionText>
                            
                            <ParagraphText>
                                {(comment) && timeSince(comment.timestamp)}
                            </ParagraphText>
                        </View>
                    )}

                    <ParagraphText style={{
                        paddingRight: 50,

                        ...((comment === undefined)?({
                            color: "transparent",
                            backgroundColor: theme.placeholder
                        }):({}))
                    }}>
                        {(comment !== undefined)?(
                            (comment)?(
                                (type === ComponentType.Compact)?(
                                    comment.message.substring(0, Math.min(80, comment.message.length)) + "..."
                                ):(comment.message)
                            ):("There's no comments, you can be the first one!")
                        ):("This is a comment!")}
                    </ParagraphText>
                </View>
            </View>
        </View>
    );
};
