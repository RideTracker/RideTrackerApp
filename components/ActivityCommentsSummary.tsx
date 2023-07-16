import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import ActivityCommentSummary from "./ActivityCommentSummary";
import { HeaderText } from "./texts/Header";
import { ParagraphText } from "./texts/Paragraph";
import { useRouter } from "expo-router";
import { getActivityCommentsSummary } from "@ridetracker/ridetrackerclient";
import { useClient } from "../modules/useClient";
import { useTheme } from "../utils/themes";
import Constants from "expo-constants";
import { useUser } from "../modules/user/useUser";
import FormInput from "./FormInput";

type ActivityCommentsSummaryProps = {
    id: string;
};

export default function ActivityCommentsSummary({ id }: ActivityCommentsSummaryProps) {
    const client = useClient();
    const router = useRouter();
    const theme = useTheme();
    const userData = useUser();

    const [ count, setCount ] = useState<number | null>(null);
    const [ comments, setComments ] = useState<{
        id: string;
        
        user?: {
            avatar: string;
            name: string;
        };

        comments_count: number;
        message: string;
        timestamp: number;
    }[] | null>(null);

    useEffect(() => {
        console.log({ id });
        getActivityCommentsSummary(client, id).then((result) => {
            console.log({result})
            if(!result.success)
                return;

            setComments(result.comments);
            setCount(result.commentsCount);
        });
    }, []);

    return (
        <View style={{ gap: 10 }}>
            {(comments)?(
                (comments.length)?(
                    <View style={{ gap: 20 }}>
                        {comments.map((comment) => (
                            <ActivityCommentSummary key={comment.id} activity={id} comment={comment}/>
                        ))}
                    </View>
                ):(
                    <TouchableOpacity onPress={() => {
                        router.push(`/activities/${id}/comments/reply`);
                    }}>
                        <View style={{
                            paddingHorizontal: 10,
                            gap: 10,
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <View style={{
                                backgroundColor: theme.placeholder,
                                width: 30,
                                aspectRatio: 1,
                                borderRadius: 100,
                                overflow: "hidden",
                            }}>
                                <Image
                                    style={{
                                        width: "100%",
                                        aspectRatio: 1,
                                        borderRadius: 100,
                                        overflow: "hidden"
                                    }}
                                    source={{
                                        uri: `${Constants.expoConfig.extra.images}/${userData.user?.avatar}/Avatar`
                                    }}/>
                            </View>
    
                            <View style={{
                                flex: 1
                            }} pointerEvents="none">
                                <FormInput placeholder="Enter a comment..." props={{
                                    pointerEvents: "none"
                                }}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            ):(Array(2).fill(null).map((_, index) => (
                <ActivityCommentSummary key={index} comment={null}/>
            )))}

            <TouchableOpacity onPress={() => router.push(`/activities/${id}/comments/list`)}>
                <ParagraphText style={{ textAlign: "center", padding: 10 }}>Show {((count - comments?.length) > 0)?(`${(count - comments.length)} more`):("all")} comments</ParagraphText>
            </TouchableOpacity>
        </View>
    );
}
