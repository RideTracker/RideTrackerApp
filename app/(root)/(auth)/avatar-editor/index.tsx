import React, { useEffect, useState } from "react";
import { Image, PixelRatio, ScrollView, View } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { useThemeConfig } from "../../../../utils/themes";
import { getAvatars } from "../../../../models/avatars";
import { CaptionText } from "../../../../components/texts/caption";

const avatarTypes = [
    {
        name: "Helmets",
        type: "helmet"
    },

    {
        name: "Sunglasses",
        type: "sunglass"
    },

    {
        name: "Heads",
        type: "head",

        required: true
    },

    {
        name: "Jerseys",
        type: "jersey",
        
        required: true
    }
];

export default function AvatarEditorPage() {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const router = useRouter();

    const [ avatars, setAvatars ] = useState(null);
    const [ combination, setCombination ] = useState(null);

    useEffect(() => {
        getAvatars(userData.key).then((result) => {
            if(!result.success)
                return;

            setAvatars(result.avatars);

            const userAvatar = result.user.avatars.find((userAvatar) => userAvatar.id === userData.user.avatar);

            if(!userAvatar) {
                setCombination({
                    head: result.avatars.find((avatar) => avatar.type === "head"),
                    jersey: result.avatars.find((avatar) => avatar.type === "jersey")
                });
            }
            else
                setCombination(userAvatar.combination);
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
                    {(avatarTypes).map((avatarType) => (
                        <React.Fragment key={avatarType.type}>
                            <CaptionText>{avatarType.name}</CaptionText>

                            <ScrollView horizontal={true}>
                                <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}>
                                    {(avatars) && avatars.filter((avatar) => avatar.type === avatarType.type).map((avatar) => (
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
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};
