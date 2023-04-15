import { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { useThemeConfig } from "../../../../utils/themes";
import { getAvatars } from "../../../../models/avatars";
import { CaptionText } from "../../../../components/texts/caption";


export default function AvatarEditorPage() {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();

    const [ avatars, setAvatars ] = useState(null);

    useEffect(() => {
        getAvatars(userData.key).then((result) => {
            if(!result.success)
                return;

            setAvatars(result.avatars);
        });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Avatar Editor" }}/>

            <View style={{
                alignItems: "center",

                borderBottomColor: themeConfig.placeholder,
                borderBottomWidth: 2
            }}>
                <Image source={{
                    uri: "https://i.imgur.com/ZRzBir4.png"
                }} style={{
                    width: "50%",
                    aspectRatio: 1
                }}/>
            </View>

            <ScrollView>
                <View style={{ padding: 10, gap: 10 }}>
                    <CaptionText>Helmets</CaptionText>

                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}>
                            {(avatars) && avatars.filter((avatar) => avatar.type === "helmet").map((avatar) => (
                                <View key={avatar.id} style={{
                                    width: 140,
                                    height: 80,

                                    borderRadius: 6,
                                    overflow: "hidden",

                                    padding: 10,

                                    backgroundColor: themeConfig.placeholder
                                }}>
                                    <Image source={{
                                        uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatar.id}/avatarspreview`
                                    }} style={{
                                        width: "100%",
                                        height: "100%",
                                        resizeMode: "contain"
                                    }}/>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    
                    <CaptionText>Sunglasses</CaptionText>

                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}>
                            {(avatars) && avatars.filter((avatar) => avatar.type === "sunglass").map((avatar) => (
                                <View key={avatar.id} style={{
                                    width: 140,
                                    height: 80,

                                    borderRadius: 6,
                                    overflow: "hidden",

                                    padding: 10,

                                    backgroundColor: themeConfig.placeholder
                                }}>
                                    <Image source={{
                                        uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatar.id}/avatarspreview`
                                    }} style={{
                                        width: "100%",
                                        height: "100%",
                                        resizeMode: "contain"
                                    }}/>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <CaptionText>Heads</CaptionText>

                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}>
                            {(avatars) && avatars.filter((avatar) => avatar.type === "head").map((avatar) => (
                                <View key={avatar.id} style={{
                                    width: 140,
                                    height: 80,

                                    borderRadius: 6,
                                    overflow: "hidden",

                                    padding: 10,

                                    backgroundColor: themeConfig.placeholder
                                }}>
                                    <Image source={{
                                        uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatar.id}/avatarspreview`
                                    }} style={{
                                        width: "100%",
                                        height: "100%",
                                        resizeMode: "contain"
                                    }}/>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <CaptionText>Jerseys</CaptionText>

                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}>
                            {(avatars) && avatars.filter((avatar) => avatar.type === "jersey").map((avatar) => (
                                <View key={avatar.id} style={{
                                    width: 140,
                                    height: 80,

                                    borderRadius: 6,
                                    overflow: "hidden",

                                    padding: 10,

                                    backgroundColor: themeConfig.placeholder
                                }}>
                                    <Image source={{
                                        uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatar.id}/avatarspreview`
                                    }} style={{
                                        width: "100%",
                                        height: "100%",
                                        resizeMode: "contain"
                                    }}/>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};
