import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useTheme } from "../utils/themes";
import { timeSince } from "../utils/time";
import { useSelector } from "react-redux";
import { ParagraphText } from "../components/texts/paragraph";
import { CaptionText } from "../components/texts/caption";
import Constants from "expo-constants";
import { useUser } from "../modules/user/useUser";
import { LinkText } from "./texts/link";

type ActivityCommentSummaryProps = {
    style?: any;
    comment: any | null;
};

function getCommentSummaryMessage(message: string, length: number) {
    let index = Math.min(message.length, length);

    for(; index !== -1; index--) {
        if(message[index] === ' ')
            break;
    }

    const result = message.substring(0, (index === 0)?(length):(index));

    return (
        <React.Fragment>
            {result}{"... "}

            {(result.length < message.length) && (
                <LinkText style={{ color: "silver" }}>view more</LinkText>
            )}
        </React.Fragment>
    );
};

export default function ActivityCommentSummary(props: ActivityCommentSummaryProps) {
    const { style, comment } = props;

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
                </View>

                <View style={{ gap: 5, justifyContent: "center", flexGrow: 1 }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: 5
                    }}>
                        <CaptionText placeholder={!comment}>
                            {comment?.user?.name}
                        </CaptionText>
                        
                        <ParagraphText>
                            {(comment) && timeSince(comment.timestamp)}
                        </ParagraphText>
                    </View>

                    <ParagraphText style={{ paddingRight: 50 }} placeholder={!comment}>
                        {(comment) && getCommentSummaryMessage(comment.message, 80)}
                    </ParagraphText>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: 5
                    }}>
                        <LinkText>Reply</LinkText>

                        {(!!comment?.comments_count) && (<ParagraphText>{comment.comments_count} replies</ParagraphText>)}
                    </View>
                </View>
            </View>
        </View>
    );
};
