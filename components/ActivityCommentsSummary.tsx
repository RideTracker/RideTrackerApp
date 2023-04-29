import { useEffect, useState } from "react";
import { View } from "react-native";
import { getActivityComments, getActivityCommentsSummary } from "../models/activity";
import { useUser } from "../modules/user/useUser";
import ActivityComment from "../layouts/activity/comment";
import { ComponentType } from "../models/componentType";
import ActivityCommentSummary from "./ActivityCommentSummary";
import { HeaderText } from "./texts/header";

type ActivityCommentsSummaryProps = {
    id: string;
};

export default function ActivityCommentsSummary(props: ActivityCommentsSummaryProps) {
    const { id } = props;

    const user = useUser();

    const [ comments, setComments ] = useState<any | null>(null);

    useEffect(() => {
        getActivityCommentsSummary(user.key, id).then((result) => {
            if(!result.success)
                return;

            setComments(result.comments);
        });
    }, []);

    return (
        <View style={{ gap: 10 }}>
            <HeaderText>Comments</HeaderText>
            
            {(comments)?(comments.map((comment) => (
                <ActivityCommentSummary key={comment.id} comment={comment}/>
            ))):(Array(2).fill(null).map((_, index) => (
                <ActivityCommentSummary key={index} comment={null}/>
            )))}
        </View>
    );
};
