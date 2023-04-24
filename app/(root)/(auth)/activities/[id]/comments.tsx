import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import { getActivityById, getActivityComments, getActivitySummaryById } from "../../../../../models/activity";
import Bike from "../../../../../components/Bike";
import { useTheme } from "../../../../../utils/themes";
import { useSelector } from "react-redux";
import { HeaderText } from "../../../../../components/texts/header";
import { ParagraphText } from "../../../../../components/texts/paragraph";
import ActivityComment from "../../../../../layouts/activity/comment";
import { useUser } from "../../../../../modules/user/useUser";

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
                <TouchableOpacity onPress={() => router.push(`/activities/${id}/comments`)} style={{ gap: 10 }}>
                    <HeaderText>Comments <Text style={{ fontWeight: "normal" }}>(0)</Text></HeaderText>

                    {(comments?.length)?(comments.filter((comment) => !comment.parent).map((comment) => (
                        <React.Fragment key={comment.id}>
                            <ActivityComment comment={comment}/>

                            <View style={{ paddingLeft: 10 }}>
                                {comments.filter((childComment) => childComment.parent === comment.id).map((childComment) => (
                                    <ActivityComment key={childComment.id} comment={childComment}/>
                                ))}
                            </View>
                        </React.Fragment>
                    ))):(
                        <ActivityComment comment={null}/>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};
