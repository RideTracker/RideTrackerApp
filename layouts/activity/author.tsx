import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ActivityResponse } from "../../models/activity";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useThemeConfig } from "../../utils/themes";

type ActivityAuthorProps = {
    activity: ActivityResponse | null;
};

export default function ActivityAuthor({ activity }: ActivityAuthorProps) {
    const router = useRouter();

    const themeConfig = useThemeConfig();

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
            }} onPress={() => activity && router.push(`/users/${activity.user}`)}>
                <View style={{
                    height: 50,
                    aspectRatio: 1,
                    
                    borderRadius: 50,
                    overflow: "hidden"
                }}>
                    {(activity && activity.user)?(
                        <Image
                            source={{
                                uri: activity.user.avatar
                            }}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}/>
                    ):(
                        <View style={{
                            backgroundColor: themeConfig.placeholder,
                            
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
                            <Text style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: themeConfig.color
                            }}>
                                {activity.user.name}
                            </Text>
                            
                            <Text style={{
                                fontSize: 18,
                                color: themeConfig.color
                            }}>
                                13 days ago in Vänersborg
                            </Text>
                        </>
                    ):(
                        <>
                            <Text style={{
                                backgroundColor: themeConfig.placeholder,
                                color: "transparent",

                                fontSize: 20,
                                fontWeight: "bold"
                            }}>
                                Firstname Lastname
                            </Text>
                            
                            <Text style={{
                                backgroundColor: themeConfig.placeholder,
                                color: "transparent",

                                fontSize: 18
                            }}>
                                13 days ago in Vänersborg
                            </Text>
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
                        <TouchableOpacity style={{
                            width: 30,
                            height: 30,

                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <FontAwesome name="thumbs-o-up" size={24} color={themeConfig.color} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={{
                            width: 30,
                            height: 30,

                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <FontAwesome name="ellipsis-v" size={24} color={themeConfig.color} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};
