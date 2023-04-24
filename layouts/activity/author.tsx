import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "../../utils/themes";
import { timeSince } from "../../utils/time";
import { CaptionText } from "../../components/texts/caption";
import { ParagraphText } from "../../components/texts/paragraph";
import Constants from "expo-constants";

type ActivityAuthorProps = {
    activity: any | null;
};

export default function ActivityAuthor({ activity }: ActivityAuthorProps) {
    const router = useRouter();

    const theme = useTheme();

    return (
        <View style={{
            flexDirection: "row",
            gap: 10,
            padding: 10
        }}>
            <TouchableOpacity disabled={activity === null} style={{
                flex: 1,
                flexDirection: "row",

                gap: 15,
            }} onPress={() => activity && router.push(`/profile/${activity.user.id}`)}>
                <View style={{
                    height: 40,
                    aspectRatio: 1,
                    
                    backgroundColor: theme.placeholder,
                    
                    borderRadius: 40,
                    overflow: "hidden"
                }}>
                    {(activity && activity.user)?(
                        <Image
                            source={{
                                uri: `${Constants.expoConfig.extra.images}/${activity.user.avatar}/Avatar`
                            }}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}/>
                    ):(
                        <View style={{
                            backgroundColor: theme.placeholder,
                            
                            width: "100%",
                            height: "100%"
                        }}/>
                    )}
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: "column",

                    justifyContent: "center",
                    gap: 4
                }}>
                    {(activity && activity.user)?(
                        <>
                            <CaptionText>{activity.user.name}</CaptionText>

                            <ParagraphText>{timeSince(activity.timestamp)} {(activity.summary?.startArea) && (`in ${activity.summary.startArea}`)}</ParagraphText>
                        </>
                    ):(
                        <>
                            <CaptionText style={{
                                backgroundColor: theme.placeholder,
                                color: "transparent"
                            }}>
                                Firstname Lastname
                            </CaptionText>
                            
                            <ParagraphText style={{
                                backgroundColor: theme.placeholder,
                                color: "transparent"
                            }}>
                                13 days ago in Vänersborg
                            </ParagraphText>
                        </>
                    )}
                </View>
            </TouchableOpacity>

            <View style={{
                justifyContent: "center",
                alignItems: "center",

                flexDirection: "row"
            }}>
                {(activity) && (
                    <>
                        {/*(activity.likes !== null) && (
                            <TouchableOpacity style={{
                                width: 30,
                                height: 30,

                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <FontAwesome name={(activity.likes)?("thumbs-up"):("thumbs-o-up")} size={24} color={theme.color} />
                            </TouchableOpacity>
                        )*/}
                        
                        <TouchableOpacity style={{
                            width: 30,
                            height: 30,

                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <FontAwesome name="ellipsis-v" size={24} color={theme.color} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};
