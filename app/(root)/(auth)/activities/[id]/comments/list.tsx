import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useTheme } from "../../../../../../utils/themes";
import ActivityComment from "../../../../../../layouts/activity/comment";
import { useClient } from "../../../../../../modules/useClient";
import { GetActivityCommentsResponse, getActivityComments } from "@ridetracker/ridetrackerclient";
import useInternetConnection from "../../../../../../modules/useInternetConnection";
import OfflinePageOverlay from "../../../../../../components/OfflinePageOverlay";
import ModalPage from "../../../../../../components/ModalPage";
import { HeaderText } from "../../../../../../components/texts/Header";
import FormDivider from "../../../../../../components/FormDivider";
import Constants from "expo-constants";
import { useUser } from "../../../../../../modules/user/useUser";
import FormInput from "../../../../../../components/FormInput";

export default function ActivityCommentsPage() {
    const client = useClient();
    const theme = useTheme();
    const { id } = useSearchParams();
    const internetConnection = useInternetConnection();
    const userData = useUser();
    const router = useRouter();

    const [ comments, setComments ] = useState<GetActivityCommentsResponse["comments"]>(null);

    useEffect(() => {
        getActivityComments(client, id as string).then((result) => {
            if(!result.success)
                return;

            setComments(result.comments);
        });
    }, []);

    return (
        <ModalPage>            
            <View style={{ padding: 10, gap: 10 }}>
                <HeaderText>Comments</HeaderText>

                {(comments)?(
                    <View style={{ maxHeight: 300 }}>
                        <ScrollView>
                            <View style={{ gap: 10 }}>
                                {comments.filter((comment) => !comment.parent).map((comment) => (
                                    <React.Fragment key={comment.id}>
                                        <ActivityComment activityId={id as string} comment={comment}/>

                                        <View style={{ marginLeft: 10, borderLeftWidth: 1, borderLeftColor: theme.border }}>
                                            <View style={{ paddingLeft: 10, gap: 10 }}>
                                                {comments.filter((childComment) => childComment.parent === comment.id).sort((a, b) => a.timestamp - b.timestamp).map((childComment) => (
                                                    <ActivityComment key={childComment.id} activityId={id as string} comment={childComment} child={true}/>
                                                ))}
                                            </View>
                                        </View>
                                    </React.Fragment>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                ):(
                    <View style={{ gap: 10 }}>
                        {Array(4).fill(null).map((_, index) => (
                            <ActivityComment key={index} comment={null}/>
                        ))}
                    </View>
                )}

                <FormDivider/>

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
            </View>

            {(internetConnection === "OFFLINE") && (
                <OfflinePageOverlay/>
            )}
        </ModalPage>
    );
}
