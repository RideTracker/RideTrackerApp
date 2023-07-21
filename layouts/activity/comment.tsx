import { Alert, Image, TouchableOpacity, View, ViewStyle, Share } from "react-native";
import { useTheme } from "../../utils/themes";
import { timeSince } from "../../utils/time";
import { ParagraphText } from "../../components/texts/Paragraph";
import { CaptionText } from "../../components/texts/Caption";
import Constants from "expo-constants";
import { useUser } from "../../modules/user/useUser";
import { useRouter } from "expo-router";
import { LinkText } from "../../components/texts/Link";
import { deleteActivityComment } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../modules/useClient";
import { getFormattedSentence } from "../../controllers/getFormattedSentence";

type ActivityCommentProps = {
    activityId?: string;
    style?: ViewStyle;
    comment?: {
        user?: {
            id: string;
            avatar: string;
            name: string;
        };

        id: string;
        activity?: string;
        parent?: string;
        message: string;
        comments_count?: number;
        timestamp: number;
    };
    child?: boolean;
    highlight?: boolean;
};

export default function ActivityComment({ activityId, style, comment, child, highlight }: ActivityCommentProps) {
    const userData = useUser();
    const theme = useTheme();
    const router = useRouter();
    const client = useClient();
    
    return (
        <View style={style}>
            <View style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                gap: 10,

                backgroundColor: (highlight)?("rgba(187,135,252, .15)"):("transparent"),
                padding: 10,
                borderRadius: 10
            }}>
                <View style={{ gap: 5, justifyContent: "center", flexGrow: 1 }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                    }}>
                        <View style={{
                            backgroundColor: theme.placeholder,
                            width: (!child)?(30):(25),
                            aspectRatio: 1,
                            borderRadius: 100,
                            overflow: "hidden",
                        }}>
                            {(comment) && (
                                <Image
                                    style={{
                                        width: "100%",
                                        aspectRatio: 1,
                                        borderRadius: 100,
                                        overflow: "hidden"
                                    }}
                                    source={{
                                        uri: `${Constants.expoConfig.extra.images}/${(comment?.user)?(comment.user.avatar):(userData.user?.avatar)}/Avatar`
                                    }}/>
                            )}
                        </View>

                        <CaptionText placeholder={!comment}>
                            {(comment)?((comment?.user)?(comment.user.name):(userData.user?.name)):("Firstname lastname")}
                        </CaptionText>
                        
                        <ParagraphText placeholder={!comment}>
                            {(comment) && timeSince(comment.timestamp)}
                        </ParagraphText>
                    </View>

                    <ParagraphText placeholder={!comment}>
                        {(comment)?(comment.message):("This is a comment!")}
                    </ParagraphText>

                    {(comment && activityId) && (
                        <View style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 10
                        }}>
                            {(!comment.parent) && (
                                <TouchableOpacity onPress={() => router.push(`/activities/${activityId}/comments/reply?commentId=${comment.id}`)}>
                                    <LinkText>Reply</LinkText>
                                </TouchableOpacity>
                            )}

                            {(!comment.parent) && (
                                <TouchableOpacity onPress={() => {
                                    Share.share({
                                        title: `"${getFormattedSentence(comment.message, 80)}" by ${comment.user.name} on the RideTracker platform!`,
                                        message: `https://ridetracker.app/activities/${activityId}/comments?highlightCommentId=${comment.id}`
                                    }, {
                                        dialogTitle: `Share ${comment.user.name}'s comment link to others!`
                                    });
                                }}>
                                    <LinkText style={{ color: "grey" }}>Share</LinkText>
                                </TouchableOpacity>
                            )}

                            {(comment.user.id === userData.user.id) && (
                                <TouchableOpacity onPress={() => {
                                    Alert.alert("Are you sure?", "Are you sure you want to delete your comment? This action is destructive", [
                                        {
                                            style: "cancel",
                                            text: "Cancel"
                                        },

                                        {
                                            style: "destructive",
                                            text: "I am sure",
                                            onPress: () => {
                                                deleteActivityComment(client, activityId, comment.id).then((result) => {
                                                    if(result.success) {
                                                        router.replace(`/activities/${activityId}/comments/list`);
                                                    }
                                                });
                                            }
                                        }
                                    ]);
                                }}>
                                    <LinkText style={{ color: theme.red, fontWeight: "bold" }}>Delete</LinkText>
                                </TouchableOpacity>
                            )}

                            {(!!comment?.comments_count) && (<ParagraphText style={{ color: "silver" }}>{comment.comments_count} replies</ParagraphText>)}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
