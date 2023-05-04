import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import { useTheme } from "../../../../../utils/themes";
import ActivityComment from "../../../../../layouts/activity/comment";
import { useUser } from "../../../../../modules/user/useUser";
import { getActivityComments } from "../../../../../controllers/activities/comments/getActivityComments";

export default function ActivityCommentsPage({ params }) {
    const userData = useUser();

    const theme = useTheme();
    
    const router = useRouter();
    const { id } = useSearchParams();

    const [ comments, setComments ] = useState(null);

    useEffect(() => {
        getActivityComments(userData.key, id as string).then((result) => {
            if(!result.success)
                return;

            setComments(result.comments);
        });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Comments" }} />

            <View style={{ padding: 10 }}>
                <View style={{ gap: 20 }}>
                    {(comments?.length)?(comments.filter((comment) => !comment.parent).map((comment) => (
                        <React.Fragment key={comment.id}>
                            <ActivityComment comment={comment}/>

                            <View style={{ paddingLeft: 50, gap: 10 }}>
                                {comments.filter((childComment) => childComment.parent === comment.id).map((childComment) => (
                                    <ActivityComment key={childComment.id} comment={childComment} child={true}/>
                                ))}
                            </View>
                        </React.Fragment>
                    ))):(
                        <ActivityComment comment={null}/>
                    )}
                </View>
            </View>
        </View>
    );
};
