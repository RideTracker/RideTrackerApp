import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack, useSearchParams } from "expo-router";
import { useTheme } from "../../../../../utils/themes";
import ActivityComment from "../../../../../layouts/activity/comment";
import { useClient } from "../../../../../modules/useClient";
import { getActivityComments } from "@ridetracker/ridetrackerclient";
import useInternetConnection from "../../../../../modules/useInternetConnection";
import OfflinePageOverlay from "../../../../../components/OfflinePageOverlay";

export default function ActivityCommentsPage() {
    const client = useClient();
    const theme = useTheme();
    const { id } = useSearchParams();
    const internetConnection = useInternetConnection();

    const [ comments, setComments ] = useState(null);

    useEffect(() => {
        getActivityComments(client, id as string).then((result) => {
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

                            <View style={{ marginLeft: 10, borderLeftWidth: 1, borderLeftColor: theme.border }}>
                                <View style={{ paddingLeft: 10, gap: 10 }}>
                                    {comments.filter((childComment) => childComment.parent === comment.id).map((childComment) => (
                                        <ActivityComment key={childComment.id} comment={childComment} child={true}/>
                                    ))}
                                </View>
                            </View>
                        </React.Fragment>
                    ))):(
                        <ActivityComment comment={null}/>
                    )}
                </View>
            </View>

            {(internetConnection === "OFFLINE") && (
                <OfflinePageOverlay/>
            )}
        </View>
    );
}
