import React, { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { useThemeConfig } from "../../../../utils/themes";
import { getAvatars } from "../../../../models/avatars";
import { CaptionText } from "../../../../components/texts/caption";
import Avatar from "../../../../components/avatar";
import { TouchableOpacity } from "react-native-gesture-handler";
import Tabs, { TabsPage } from "../../../../components/tabs";
import { FontAwesome5 } from "@expo/vector-icons";

const avatarTypes = [
    {
        name: "Helmets",
        type: "helmet",
        tab: "appearance"
    },

    {
        name: "Sunglasses",
        type: "sunglass",
        tab: "appearance"
    },

    {
        name: "Heads",
        type: "head",
        tab: "appearance",

        required: true
    },

    {
        name: "Jerseys",
        type: "jersey",
        tab: "appearance",
        
        required: true
    },

    {
        name: "Wallapers",
        type: "wallpaper",
        tab: "wallpapers",
        
        required: false
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
                position: "relative"
            }}>
                {(combination?.wallpaper) && (
                    <Image source={{
                        uri: `https://imagedelivery.net/iF-n-0zUOubWqw15Yx-oAg/${combination.wallpaper.id}/wallpaper`
                    }} style={{
                        position: "absolute",

                        width: "100%",
                        height: "100%",

                        resizeMode: "cover",
                        
                        left: 0,
                        bottom: 0
                    }}/>
                )}

                {(combination) && (<Avatar combination={combination}/>)}
            </View>

            <Tabs initialTab={"appearance"} style={{ flex: 1 }}>
                <TabsPage id={"appearance"} title={"Appearance"}>
                    <ScrollView>
                        <View style={{ padding: 10, gap: 10 }}>
                            {(avatarTypes).filter((avatarType) => avatarType.tab === "appearance").map((avatarType) => (
                                <React.Fragment key={avatarType.type}>
                                    <CaptionText>{avatarType.name}</CaptionText>

                                    <ScrollView horizontal={true}>
                                        <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10, height: 90 }}>
                                            {(!avatarType.required) && (
                                                <TouchableOpacity onPress={() => setCombination({ ...combination, [avatarType.type]: null })} style={{
                                                    width: 140,
                                                    height: 80,

                                                    borderRadius: 6,
                                                    overflow: "hidden",

                                                    justifyContent: "center",
                                                    alignItems: "center",

                                                    padding: 10,

                                                    borderWidth: (!combination || !combination[avatarType.type])?(1):(0),
                                                    borderColor: themeConfig.border
                                                }}>
                                                    <FontAwesome5 name="times-circle" size={48} color={themeConfig.placeholder}/>
                                                </TouchableOpacity>
                                            )}

                                            {(avatars) && avatars.filter((avatar) => avatar.type === avatarType.type).map((avatar) => (
                                                <TouchableOpacity key={avatar.id} onPress={() => setCombination({ ...combination, [avatar.type]: avatar })} style={{
                                                    width: 140,
                                                    height: 80,

                                                    borderRadius: 6,
                                                    overflow: "hidden",

                                                    padding: 10,

                                                    backgroundColor: (combination && combination[avatar.type]?.id === avatar.id)?(themeConfig.highlight):(themeConfig.placeholder),
                                                    borderWidth: (combination && combination[avatar.type]?.id === avatar.id)?(1):(0),
                                                    borderColor: themeConfig.border
                                                }}>
                                                    <Image source={{
                                                        uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatar.id}/avatarspreview`
                                                    }} style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        resizeMode: "contain"
                                                    }}/>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>
                                </React.Fragment>
                            ))}
                        </View>
                    </ScrollView>
                </TabsPage>

                <TabsPage id={"wallpapers"} title={"Wallpapers"} style={{ gap: 10, padding: 10 }}>
                    {(avatarTypes).filter((avatarType) => avatarType.tab === "wallpapers").map((avatarType) => (
                        <React.Fragment key={avatarType.type}>
                            <ScrollView>
                                <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10, height: 90 }}>
                                    {(avatars) && avatars.filter((avatar) => avatar.type === avatarType.type).map((avatar) => (
                                        <TouchableOpacity key={avatar.id} onPress={() => setCombination({ ...combination, [avatar.type]: avatar })} style={{
                                            width: 140,
                                            height: 80,

                                            borderRadius: 6,
                                            overflow: "hidden",

                                            backgroundColor: (combination && combination[avatar.type]?.id === avatar.id)?(themeConfig.highlight):(themeConfig.placeholder),
                                            borderWidth: (combination && combination[avatar.type]?.id === avatar.id)?(1):(0),
                                            borderColor: themeConfig.border
                                        }}>
                                            <Image source={{
                                                uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatar.id}/wallpaper`
                                            }} style={{
                                                width: 140,
                                                height: 80,
                                                resizeMode: "cover"
                                            }}/>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </React.Fragment>
                    ))}
                </TabsPage>

                <TabsPage id={"history"} title={"History"}>

                </TabsPage>
            </Tabs>
        </View>
    );
};
