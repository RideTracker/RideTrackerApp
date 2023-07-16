import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSearchParams, useSegments } from "expo-router";
import { useTheme } from "../../../../../../utils/themes";
import ActivityComment from "../../../../../../layouts/activity/comment";
import { useClient } from "../../../../../../modules/useClient";
import { GetActivityCommentResponse, GetActivityCommentsResponse, createActivityComment, getActivityComment, getActivityComments } from "@ridetracker/ridetrackerclient";
import useInternetConnection from "../../../../../../modules/useInternetConnection";
import OfflinePageOverlay from "../../../../../../components/OfflinePageOverlay";
import ModalPage from "../../../../../../components/ModalPage";
import { HeaderText } from "../../../../../../components/texts/Header";
import FormDivider from "../../../../../../components/FormDivider";
import Constants from "expo-constants";
import { useUser } from "../../../../../../modules/user/useUser";
import FormInput from "../../../../../../components/FormInput";
import { FontAwesome } from "@expo/vector-icons";

export default function ActivityCommentsPage() {
    const client = useClient();
    const theme = useTheme();
    const { id, commentId } = useSearchParams();
    const internetConnection = useInternetConnection();
    const userData = useUser();
    const router = useRouter();

    const [ text, setText ] = useState<string>("");
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ comment, setComment ] = useState<GetActivityCommentResponse["comment"]>(null);

    useEffect(() => {
        if(commentId) {
            getActivityComment(client, id as string, commentId as string).then((result) => {
                console.log({ id, commentId });
                console.log({result});

                if(result.success) {
                    setComment(result.comment);
                }
            });
        }
    }, []);

    return (
        <ModalPage>            
            <View style={{ padding: 10, gap: 10 }}>
                <HeaderText>Reply {(commentId)?("to comment"):("to activity")}</HeaderText>

                {(commentId) && (<ActivityComment comment={comment}/>)}

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
                    }}>
                        <FormInput placeholder="Enter a comment..." props={{
                            autoFocus: true,
                            onChangeText: (text) => setText(text)
                        }}/>
                    </View>

                    <TouchableOpacity style={{
                        height: 30,
                        width: 30,

                        justifyContent: "center",
                        alignItems: "center"
                    }} onPress={() => {
                        setSubmitting(true);

                        createActivityComment(client, id as string, text, commentId as string ?? null).then((result) => {
                            if(result.success) {
                                router.back();

                                router.replace(`/activities/${id}/comments/list`);
                            }
                            else
                                setSubmitting(false); 
                        });
                    }}>
                        {(!submitting)?(
                            <FontAwesome name="send" size={20} color={(text.length)?(theme.color):("grey")}/>
                        ):(
                            <ActivityIndicator color={theme.color}/>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {(internetConnection === "OFFLINE") && (
                <OfflinePageOverlay/>
            )}
        </ModalPage>
    );
}
