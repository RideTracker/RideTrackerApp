import React, { useEffect, useState } from "react";
import { Image, ScrollView, View, ActivityIndicator } from "react-native";
import { useRouter, Stack, useSearchParams, useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import { useTheme } from "../../../../utils/themes";
import { CaptionText } from "../../../../components/texts/Caption";
import { TouchableOpacity } from "react-native-gesture-handler";
import Tabs, { TabsPage } from "../../../../components/Tabs";
import { FontAwesome5 } from "@expo/vector-icons";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../../../components/Colors";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import Constants from "expo-constants";
import { setUserData } from "../../../../utils/stores/userData";
import Avatar from "../../../../components/Avatar";
import { useUser } from "../../../../modules/user/useUser";
import { setClient } from "../../../../utils/stores/client";
import { useAvatarClient } from "../../../../modules/useAvatarClient";
import { GetUserAvatarsResponse, createUserAvatar, getAvatars, getUserAvatars } from "@ridetracker/avatarclient";
import { createRideTrackerClient, authenticateUser, uploadUserAvatar } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../modules/useClient";
import Button from "../../../../components/Button";

export default function AvatarEditorPage() {
    const userData = useUser();
    const client = useClient();
    const avatarClient = useAvatarClient();

    const theme = useTheme();

    const avatarTypes = [
        {
            name: "Helmets",
            type: "helmet",
            tab: "appearance",
            icon: (<MaterialCommunityIcons name="racing-helmet" size={24} color={theme.color}/>)
        },
    
        {
            name: "Sunglasses",
            type: "sunglass",
            tab: "appearance",
            icon: (<MaterialCommunityIcons name="sunglasses" size={24} color={theme.color}/>)
        },
    
        {
            name: "Heads",
            type: "head",
            tab: "appearance",
            icon: (<MaterialCommunityIcons name="head" size={24} color={theme.color}/>),
    
            required: true
        },
    
        {
            name: "Jerseys",
            type: "jersey",
            tab: "appearance",
            icon: (<MaterialCommunityIcons name="tshirt-crew" size={24} color={theme.color}/>),
            
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
    const navigation = useNavigation();

    const { from_registration } = useSearchParams();

    const [ dataUrl, setDataUrl ] = useState(null);
    const [ picker, setPicker ] = useState(null);
    const [ avatars, setAvatars ] = useState(null);
    const [ combination, setCombination ] = useState(null);
    const [ tabType, setTabType ] = useState("helmet");
    const [ uploading, setUploading ] = useState(false);
    const [ userAvatars, setUserAvatars ] = useState<GetUserAvatarsResponse["avatars"]>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        getAvatars(avatarClient).then((result) => {
            if(!result.success)
                return;

            setAvatars(result.avatars);

            getUserAvatars(avatarClient).then((userResult) => {
                setUserAvatars(userResult.avatars);

                if(!userResult.avatars.length) {
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
                else {
                    setCombination(JSON.parse(userResult.avatars[0].combination));
                }
            });
        });
    }, []);

    useEffect(() => {
        if(uploading) {
            Promise.all([
                uploadUserAvatar(client, dataUrl).then(async (result) => {
                    if(!result.success)
                        return setUploading(false);

                    const authentication = await authenticateUser(client);

                    if(authentication.success) {
                        dispatch(setClient(createRideTrackerClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api, {
                            identity: userData.email,
                            key: authentication.token.key,
                            type: "Basic"
                        })));

                        dispatch(setUserData({
                            email: userData.email,
                            token: authentication.token
                        }));
                    }
                }),
                createUserAvatar(avatarClient, combination)
            ]).then(() => {
                if(from_registration || !navigation.canGoBack())
                    router.push("/");
                else 
                    router.back();
            });
        }
    }, [ uploading ]);

    useEffect(() => {
        setPicker(null);
    }, [ tabType ]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Avatar Editor",

                headerLeft: (from_registration)?(() => <View/>):(undefined),

                headerRight: (from_registration)?(() => <View/>):(() => (
                    <TouchableOpacity disabled={!dataUrl || uploading} onPress={() => setUploading(true)}>
                        <ParagraphText style={{ fontSize: 21, fontWeight: "400", opacity: (uploading)?(0.5):(1) }}>Save</ParagraphText>
                    </TouchableOpacity>
                ))
            }}/>

            <View style={{
                alignItems: "center",
                position: "relative",

                height: 225,

                overflow: "hidden"
            }}>
                {(combination?.wallpaper) && (
                    <Image source={{
                        uri: `${Constants.expoConfig.extra.images}/${avatars.find((avatar) => avatar.id === combination.wallpaper.id).image}/wallpaper`
                    }} style={{
                        position: "absolute",

                        width: "100%",
                        height: "100%",

                        resizeMode: "cover",
                        
                        left: 0,
                        bottom: 0
                    }}/>
                )}

                <View style={{ aspectRatio: 1 }}>
                    {(avatars && combination) && (<Avatar avatars={avatars} combination={combination} onDataUrl={(url) => setDataUrl(url)}/>)}
                </View>
            </View>

            <Tabs initialTab={"appearance"} onChange={(tab) => setTabType(avatarTypes.find((avatarType) => avatarType.tab == tab)?.type)} style={{
                flex: 1,
                opacity: (uploading)?(0.5):(1)
            }} pointerEvents={(uploading)?("none"):("auto")}>
                <TabsPage id={"appearance"} title={"Appearance"}>
                    <ScrollView>
                        <View style={{ paddingVertical: 10, paddingBottom: 50, gap: 10 }}>
                            <ScrollView horizontal={true}>
                                <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingBottom: 10 }}>
                                    {(avatarTypes).filter((avatarType) => avatarType.tab === "appearance").map((avatarType) => (
                                        <TouchableOpacity key={avatarType.type} style={{
                                            height: 40,

                                            borderRadius: 6,
                                            overflow: "hidden",

                                            flexDirection: "row",
                                            gap: 10,

                                            alignItems: "center",

                                            padding: 10,

                                            backgroundColor: (tabType === avatarType.type)?(theme.highlight):(theme.placeholder),
                                            borderWidth: 1,
                                            borderColor: (tabType === avatarType.type)?(theme.border):("transparent")
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
                                    <CaptionText style={{ paddingHorizontal: 10 }}>{avatarType.name}</CaptionText>

                                    <ScrollView horizontal={true}>
                                        <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingBottom: 10, height: 90 }}>
                                            {(!avatarType.required) && (
                                                <TouchableOpacity onPress={() => {
                                                    setCombination({ ...combination, [avatarType.type]: null });
                                                    setPicker(null);
                                                }} style={{
                                                    width: 140,
                                                    height: 80,

                                                    borderRadius: 6,
                                                    overflow: "hidden",

                                                    justifyContent: "center",
                                                    alignItems: "center",

                                                    padding: 10,

                                                    borderWidth: (!combination || !combination[avatarType.type])?(1):(0),
                                                    borderColor: theme.border
                                                }}>
                                                    <FontAwesome5 name="times-circle" size={48} color={theme.placeholder}/>
                                                </TouchableOpacity>
                                            )}

                                            {(avatars) && avatars.filter((avatar) => avatar.type === avatarType.type).map((avatar) => (
                                                <TouchableOpacity key={avatar.id} onPress={() => {
                                                    setCombination({ ...combination, [avatar.type]: { id: avatar.id, colors: [] } });
                                                    setPicker(null);
                                                }} style={{
                                                    width: 140,
                                                    height: 80,

                                                    borderRadius: 6,
                                                    overflow: "hidden",

                                                    padding: 10,

                                                    backgroundColor: (combination && combination[avatar.type]?.id === avatar.id)?(theme.highlight):(theme.placeholder),
                                                    borderWidth: (combination && combination[avatar.type]?.id === avatar.id)?(1):(0),
                                                    borderColor: theme.border
                                                }}>
                                                    <Image source={{
                                                        uri: `${Constants.expoConfig.extra.images}/${avatar.image}/avatarspreview`
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
                                            <CaptionText style={{ textTransform: "capitalize", paddingHorizontal: 10 }}>{color.type}</CaptionText>

                                            <Colors key={combination[tabType].id + color.type} defaultColor={color.defaultColor} initialColor={combination[tabType].colors.find((combinationColor) => combinationColor.type === color.type)?.color ?? color.defaultColor} type={color.type} picker={picker === color.type} showPicker={(show) => {
                                                if(!show && color.type === picker)
                                                    setPicker(null);
                                                else if(show)
                                                    setPicker(color.type);
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
                        <View style={{ paddingVertical: 10, paddingBottom: 50, gap: 10 }}>
                            {(avatarTypes).filter((avatarType) => avatarType.tab === "wallpaper" && avatarType.type === tabType).map((avatarType) => (
                                <React.Fragment key={avatarType.type}>
                                    <CaptionText style={{ paddingHorizontal: 10 }}>{avatarType.name}</CaptionText>

                                    <ScrollView horizontal={true}>
                                        <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingBottom: 10, height: 90 }}>
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
                                                    borderColor: theme.border
                                                }}>
                                                    <FontAwesome5 name="times-circle" size={48} color={theme.placeholder}/>
                                                </TouchableOpacity>
                                            )}

                                            {(avatars) && avatars.filter((avatar) => avatar.type === avatarType.type).map((avatar) => (
                                                <TouchableOpacity key={avatar.id} onPress={() => setCombination({ ...combination, [avatar.type]: { id: avatar.id, colors: [] } })} style={{
                                                    width: 140,
                                                    height: 80,

                                                    borderRadius: 6,
                                                    overflow: "hidden",

                                                    backgroundColor: (combination && combination[avatar.type]?.id === avatar.id)?(theme.highlight):(theme.placeholder),
                                                    borderWidth: (combination && combination[avatar.type]?.id === avatar.id)?(1):(0),
                                                    borderColor: theme.border
                                                }}>
                                                    <Image source={{
                                                        uri: `${Constants.expoConfig.extra.images}/${avatar.image}/avatarspreview`
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

                                            <Colors defaultColor={color.defaultColor} initialColor={color.defaultColor} type={color.type} picker={picker === color.type} showPicker={(show) => {
                                                if(!show && color.type === picker)
                                                    setPicker(null);
                                                else if(show)
                                                    setPicker(color.type);
                                            }} colorChange={(hex) => setCombination({ ...combination, [tabType]: { ...combination[tabType], colors: [ ...combination[tabType].colors.filter((combinationColor) => combinationColor.index !== color.index), { color: hex, index: color.index } ] } })}/>
                                        </React.Fragment>
                                    )))}
                                </React.Fragment>
                            ))}
                        </View>
                    </ScrollView>
                </TabsPage>

                <TabsPage id={"history"} title={"History"}>
                    <ScrollView>
                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap"                        
                        }}>
                            {userAvatars?.map((userAvatar) => (
                                <View key={userAvatar.id} style={{ width: "50%", padding: 10 }}>
                                    <TouchableOpacity style={{ aspectRatio: 1, padding: 10 }} onPress={() => setCombination(JSON.parse(userAvatar.combination))}>
                                        <Avatar combination={JSON.parse(userAvatar.combination)} avatars={avatars} onDataUrl={() => {}}/>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </TabsPage>
            </Tabs>

            {(from_registration) && (
                <View style={{ padding: 10, gap: 10 }}>
                    <Button disabled={!dataUrl || uploading} primary={true} label={(!uploading) && ("Finish registration")} onPress={() => setUploading(true)}>
                        {(uploading) && (<ActivityIndicator color={theme.color}/>)}
                    </Button>

                    <Button primary={false} label="Skip avatar creation" onPress={() => router.push("/feed")}/>
                </View>
            )}
        </View>
    );
}
