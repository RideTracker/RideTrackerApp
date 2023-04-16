import React, { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { useThemeConfig } from "../../../../utils/themes";
import { getAvatars } from "../../../../models/avatars";
import { CaptionText } from "../../../../components/texts/caption";
import Avatar from "../../../../components/avatar";
import { TouchableOpacity } from "react-native-gesture-handler";

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
                {(combination) && (<Avatar combination={combination}/>)}
            </View>

            <ScrollView>
                <View style={{ padding: 10, gap: 10 }}>
                    {(avatarTypes).map((avatarType) => (
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

                                            padding: 10,

                                            backgroundColor: (!combination || !combination[avatarType.type])?("transparent"):(themeConfig.placeholder)
                                        }}>
                                            <CaptionText>I DON'T WANT TO BE HERE</CaptionText>
                                        </TouchableOpacity>
                                    )}

                                    {(avatars) && avatars.filter((avatar) => avatar.type === avatarType.type).map((avatar) => (
                                        <TouchableOpacity key={avatar.id} onPress={() => setCombination({ ...combination, [avatar.type]: avatar })} style={{
                                            width: 140,
                                            height: 80,

                                            borderRadius: 6,
                                            overflow: "hidden",

                                            padding: 10,

                                            backgroundColor: (combination && combination[avatar.type]?.id === avatar.id)?("transparent"):(themeConfig.placeholder)
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
        </View>
    );
};
