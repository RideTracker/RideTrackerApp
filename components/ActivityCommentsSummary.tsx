import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { getActivityComments, getActivityCommentsSummary } from "../models/activity";
import { useUser } from "../modules/user/useUser";
import ActivityComment from "../layouts/activity/comment";
import { ComponentType } from "../models/componentType";
import ActivityCommentSummary from "./ActivityCommentSummary";
import { HeaderText } from "./texts/header";
import { LinkText } from "./texts/link";
import { ParagraphText } from "./texts/paragraph";
import Button from "./Button";
import { useRouter } from "expo-router";

type ActivityCommentsSummaryProps = {
    id: string;
};

export default function ActivityCommentsSummary(props: ActivityCommentsSummaryProps) {
    const { id } = props;

    const user = useUser();
    const router = useRouter();

    const [ count, setCount ] = useState<number | null>(null);
    const [ comments, setComments ] = useState<any | null>(null);

    useEffect(() => {
        getActivityCommentsSummary(user.key, id).then((result) => {
            if(!result.success)
                return;

            setComments(result.comments);
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
};
