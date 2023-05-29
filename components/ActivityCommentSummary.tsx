import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useTheme } from "../utils/themes";
import { timeSince } from "../utils/time";
import { ParagraphText } from "../components/texts/Paragraph";
import { CaptionText } from "../components/texts/Caption";
import Constants from "expo-constants";
import { LinkText } from "./texts/Link";
import { useRouter } from "expo-router";

type ActivityCommentSummaryProps = {
    style?: any;
    comment: any | null;
    activity?: string;
};

function getCommentSummaryMessage(message: string, length: number) {
    let index = Math.min(message.length, length);

    for(; index !== -1; index--) {
        if(message[index] === " ")
            break;
    }

    const result = message.substring(0, (index === 0)?(length):(index));

    return (
        <React.Fragment>
            {result}{(result.length < message.length) && "... "}

            {(result.length < message.length) && (
                <LinkText style={{ color: "silver" }}>view more</LinkText>
            )}
        </React.Fragment>
    );
}

export default function ActivityCommentSummary(props: ActivityCommentSummaryProps) {
    const { activity, style, comment } = props;

    const theme = useTheme();
    const router = useRouter();
    
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
                    {(comment?.user) && (
                        <Image
                            style={{
                                width: 40,
                                aspectRatio: 1,
                                borderRadius: 40,
                                overflow: "hidden"
                            }}
                            source={{
                                uri: `${Constants.expoConfig.extra.images}/${comment.user.avatar}/Avatar`
                            }}/>
                    )}
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
                        <TouchableOpacity onPress={() => router.push(`/activities/${activity}/comments/${comment.id}/reply`)}>
                            <LinkText>Reply</LinkText>
                        </TouchableOpacity>

                        {(!!comment?.comments_count) && (<ParagraphText style={{ color: "silver" }}>{comment.comments_count} {(comment.comments_counts > 1)?("replies"):("reply")}</ParagraphText>)}
                    </View>
                </View>
            </View>
        </View>
    );
}
