import { Image, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../utils/themes";
import { timeSince } from "../../utils/time";
import { ParagraphText } from "../../components/texts/Paragraph";
import { CaptionText } from "../../components/texts/Caption";
import Constants from "expo-constants";
import { useUser } from "../../modules/user/useUser";
import { useRouter } from "expo-router";
import { LinkText } from "../../components/texts/Link";

type ActivityCommentProps = {
    style?: any;
    comment?: any;
    child?: boolean;
};

export default function ActivityComment(props: ActivityCommentProps) {
    const { style, comment, child } = props;

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
                <View style={{
                    backgroundColor: theme.placeholder,
                    width: (!child)?(40):(25),
                    aspectRatio: 1,
                    borderRadius: 100,
                    overflow: "hidden",
                }}>
                    {(comment !== undefined) && (
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

                <View style={{ gap: 5, justifyContent: "center", flexGrow: 1 }}>
                    {(comment || comment === undefined) && (
                        <View style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 5
                        }}>
                            <CaptionText style={(comment === undefined) && {
                                color: "transparent",
                                backgroundColor: theme.placeholder
                            }}>
                                {(comment)?(
                                    (comment?.user)?(comment.user.name):(userData.user?.name)
                                ):((comment === undefined) && ("Firstname lastname"))}
                            </CaptionText>
                            
                            <ParagraphText>
                                {(comment) && timeSince(comment.timestamp)}
                            </ParagraphText>
                        </View>
                    )}

                    <ParagraphText style={{
                        paddingRight: ((!child)?(40):(25)) + 10,

                        ...((comment === undefined)?({
                            color: "transparent",
                            backgroundColor: theme.placeholder
                        }):({}))
                    }}>
                        {(comment !== undefined)?(
                            (comment)?(comment.message):("There's no comments, you can be the first one!")
                        ):("This is a comment!")}
                    </ParagraphText>

                    {(comment) && (
                        <View style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 5
                        }}>
                            <TouchableOpacity onPress={() => router.push(`/activities/${comment.activity}/comments/${comment.id}/reply`)}>
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
