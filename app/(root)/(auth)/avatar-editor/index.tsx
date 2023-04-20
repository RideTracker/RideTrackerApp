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

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../../../components/colors";

export default function AvatarEditorPage() {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const avatarTypes = [
        {
            name: "Helmets",
            type: "helmet",
            tab: "appearance",
            icon: (<MaterialCommunityIcons name="racing-helmet" size={24} color={themeConfig.color}/>)
        },
    
        {
            name: "Sunglasses",
            type: "sunglass",
            tab: "appearance",
            icon: (<MaterialCommunityIcons name="sunglasses" size={24} color={themeConfig.color}/>)
        },
    
        {
            name: "Heads",
            type: "head",
            tab: "appearance",
            icon: (<MaterialCommunityIcons name="head" size={24} color={themeConfig.color}/>),
    
            required: true
        },
    
        {
            name: "Jerseys",
            type: "jersey",
            tab: "appearance",
            icon: (<MaterialCommunityIcons name="tshirt-crew" size={24} color={themeConfig.color}/>),
            
            required: true
        },
    
        {
            name: "Wallpapers",
            type: "wallpaper",
            tab: "wallpaper",
            icon: null,
            
            required: false
        }
    ];

    const router = useRouter();

    const [ picker, setPicker ] = useState(null);
    const [ avatars, setAvatars ] = useState(null);
    const [ combination, setCombination ] = useState(null);
    const [ tabType, setTabType ] = useState("helmet");

    useEffect(() => {
        getAvatars(userData.key).then((result) => {
            if(!result.success)
                return;

            setAvatars(result.avatars);

            const userAvatar = result.user.avatars.find((userAvatar) => userAvatar.id === userData.user.avatar);

            if(!userAvatar) {
                setCombination({
                    head: {
                        id: result.avatars.find((avatar) => avatar.type === "head").id,
                        colors: []
                    },

                    jersey: {
                        id: result.avatars.find((avatar) => avatar.type === "jersey").id,
                        colors: []
                    }
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
                position: "relative",

                height: 225,

                overflow: "hidden"
            }}>
                {(combination?.wallpaper) && (
                    <Image source={{
                        uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatars.find((avatar) => avatar.id === combination.wallpaper.id).image}/wallpaper`
                    }} style={{
                        position: "absolute",

                        width: "100%",
                        height: "100%",

                        resizeMode: "cover",
                        
                        left: 0,
                        bottom: 0
                    }}/>
                )}

                {(avatars && combination) && (<Avatar avatars={avatars} combination={combination}/>)}
            </View>

            <Tabs initialTab={"appearance"} style={{ flex: 1 }} onChange={(tab) => setTabType(avatarTypes.find((avatarType) => avatarType.tab == tab).type)}>
                <TabsPage id={"appearance"} title={"Appearance"}>
                    <ScrollView>
                        <View style={{ padding: 10, paddingBottom: 50, gap: 10 }}>
                            <ScrollView horizontal={true}>
                                <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}>
                                    {(avatarTypes).filter((avatarType) => avatarType.tab === "appearance").map((avatarType) => (
                                        <TouchableOpacity key={avatarType.type} style={{
                                            height: 40,

                                            borderRadius: 6,
                                            overflow: "hidden",

                                            flexDirection: "row",
                                            gap: 10,

                                            alignItems: "center",

                                            padding: 10,

                                            backgroundColor: (tabType === avatarType.type)?(themeConfig.highlight):(themeConfig.placeholder),
                                            borderWidth: 1,
                                            borderColor: (tabType === avatarType.type)?(themeConfig.border):("transparent")
                                        }} onPress={() => setTabType(avatarType.type)}>
                                            <View style={{ marginTop: -3 }}>
                                                {avatarType.icon}
                                            </View>

                                            <CaptionText>{avatarType.name}</CaptionText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {(avatarTypes).filter((avatarType) => avatarType.tab === "appearance" && avatarType.type === tabType).map((avatarType) => (
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
                                                <TouchableOpacity key={avatar.id} onPress={() => setCombination({ ...combination, [avatar.type]: { id: avatar.id, colors: [] } })} style={{
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
                                                        uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatar.image}/avatarspreview`
                                                    }} style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        resizeMode: "contain"
                                                    }}/>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>

                                    {(combination && combination[tabType]) && (avatars.find((avatar) => avatar.id === combination[tabType].id).colors.filter((avatarColor) => avatarColor.defaultColor).sort((a, b) => a.index - b.index).map((color) => (
                                        <React.Fragment key={combination[tabType].id + color.type}>
                                            <CaptionText style={{ textTransform: "capitalize" }}>{color.type}</CaptionText>

                                            <Colors initialColor={color.defaultColor} type={color.type} picker={picker === color.type} showPicker={(show) => {
                                                if(!show && color.type === picker)
                                                    setPicker(null);
                                                else if(show)
                                                    setPicker(color.type)
                                            }} colorChange={(hex) => setCombination({ ...combination, [tabType]: { ...combination[tabType], colors: [ ...combination[tabType].colors.filter((combinationColor) => combinationColor.type !== color.type), { color: hex, type: color.type } ] } })}/>
                                        </React.Fragment>
                                    )))}
                                </React.Fragment>
                            ))}
                        </View>
                    </ScrollView>
                </TabsPage>

                <TabsPage id={"wallpaper"} title={"Wallpapers"} style={{ gap: 10 }}>
                    <ScrollView>
                        <View style={{ padding: 10, paddingBottom: 50, gap: 10 }}>
                            <ScrollView horizontal={true}>
                                <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}>
                                    {(avatarTypes).filter((avatarType) => avatarType.tab === "wallpaper").map((avatarType) => (
                                        <TouchableOpacity key={avatarType.type} style={{
                                            height: 40,

                                            borderRadius: 6,
                                            overflow: "hidden",

                                            flexDirection: "row",
                                            gap: 10,

                                            alignItems: "baseline",

                                            padding: 10,

                                            backgroundColor: (tabType === avatarType.type)?(themeConfig.highlight):(themeConfig.placeholder),
                                            borderWidth: 1,
                                            borderColor: (tabType === avatarType.type)?(themeConfig.border):("transparent")
                                        }} onPress={() => setTabType(avatarType.type)}>
                                            {avatarType.icon}

                                            <CaptionText>{avatarType.name}</CaptionText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {(avatarTypes).filter((avatarType) => avatarType.tab === "wallpaper" && avatarType.type === tabType).map((avatarType) => (
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
                                                <TouchableOpacity key={avatar.id} onPress={() => setCombination({ ...combination, [avatar.type]: { id: avatar.id, colors: [] } })} style={{
                                                    width: 140,
                                                    height: 80,

                                                    borderRadius: 6,
                                                    overflow: "hidden",

                                                    backgroundColor: (combination && combination[avatar.type]?.id === avatar.id)?(themeConfig.highlight):(themeConfig.placeholder),
                                                    borderWidth: (combination && combination[avatar.type]?.id === avatar.id)?(1):(0),
                                                    borderColor: themeConfig.border
                                                }}>
                                                    <Image source={{
                                                        uri: `https://ridetracker.app/cdn-cgi/imagedelivery/iF-n-0zUOubWqw15Yx-oAg/${avatar.image}/avatarspreview`
                                                    }} style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        resizeMode: "cover"
                                                    }}/>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>

                                    {(combination && combination[tabType]) && (avatars.find((avatar) => avatar.id === combination[tabType].id).colors.filter((avatarColor) => avatarColor.defaultColor).sort((a, b) => a.index - b.index).map((color) => (
                                        <React.Fragment key={combination[tabType].id + color.type}>
                                            <CaptionText style={{ textTransform: "capitalize" }}>{color.type}</CaptionText>

                                            <Colors initialColor={color.defaultColor} type={color.type} picker={picker === color.type} showPicker={(show) => {
                                                if(!show && color.type === picker)
                                                    setPicker(null);
                                                else if(show)
                                                    setPicker(color.type)
                                            }} colorChange={(hex) => setCombination({ ...combination, [tabType]: { ...combination[tabType], colors: [ ...combination[tabType].colors.filter((combinationColor) => combinationColor.index !== color.index), { color: hex, index: color.index } ] } })}/>
                                        </React.Fragment>
                                    )))}
                                </React.Fragment>
                            ))}
                        </View>
                    </ScrollView>
                </TabsPage>

                <TabsPage id={"history"} title={"History"}>

                </TabsPage>
            </Tabs>
        </View>
    );
};
