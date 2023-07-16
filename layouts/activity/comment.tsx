import { Image, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../../utils/themes";
import { timeSince } from "../../utils/time";
import { ParagraphText } from "../../components/texts/Paragraph";
import { CaptionText } from "../../components/texts/Caption";
import Constants from "expo-constants";
import { useUser } from "../../modules/user/useUser";
import { useRouter } from "expo-router";
import { LinkText } from "../../components/texts/Link";

type ActivityCommentProps = {
    activityId?: string;
    style?: ViewStyle;
    comment?: {
        user?: {
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
};

export default function ActivityComment(props: ActivityCommentProps) {
    const { activityId, style, comment, child } = props;

    const userData = useUser();
    const theme = useTheme();
    const router = useRouter();
    
    return (
        <View style={style}>
            <View style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                gap: 10
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

                    {(comment && activityId && !comment.parent) && (
                        <View style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 5
                        }}>
                            <TouchableOpacity onPress={() => router.push(`/activities/${activityId}/comments/reply?commentId=${comment.id}`)}>
                                <LinkText>Reply</LinkText>
                            </TouchableOpacity>

                            {(!!comment?.comments_count) && (<ParagraphText style={{ color: "silver" }}>{comment.comments_count} replies</ParagraphText>)}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
