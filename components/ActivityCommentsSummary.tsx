import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import ActivityCommentSummary from "./ActivityCommentSummary";
import { HeaderText } from "./texts/Header";
import { ParagraphText } from "./texts/Paragraph";
import { useRouter } from "expo-router";
import { getActivityCommentsSummary } from "@ridetracker/ridetrackerclient";
import { useClient } from "../modules/useClient";

type ActivityCommentsSummaryProps = {
    id: string;
};

export default function ActivityCommentsSummary(props: ActivityCommentsSummaryProps) {
    const { id } = props;

    const client = useClient();
    const router = useRouter();

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
        getActivityCommentsSummary(client, id).then((result) => {
            if(!result.success)
                return;

            setComments(result.comments);
            setCount(result.commentsCount);
        });
    }, []);

    return (
        <View style={{ gap: 20 }}>
            <HeaderText>Comments</HeaderText>

            {(comments)?(
                <React.Fragment>
                    <View style={{ gap: 20 }}>
                        {comments.map((comment) => (
                            <ActivityCommentSummary key={comment.id} activity={id} comment={comment}/>
                        ))}
                    </View>
                    <TouchableOpacity onPress={() => router.push(`/activities/${id}/comments`)}>
                        <ParagraphText style={{ textAlign: "center", padding: 10 }}>Show {((count - comments.length) > 0)?(`${(count - comments.length)} more`):("all")} comments</ParagraphText>
                    </TouchableOpacity>
                </React.Fragment>
            ):(Array(2).fill(null).map((_, index) => (
                <ActivityCommentSummary key={index} comment={null}/>
            )))}
        </View>
    );
}
