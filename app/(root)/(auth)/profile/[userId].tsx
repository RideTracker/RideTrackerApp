import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useTheme } from "../../../../utils/themes";
import { CaptionText } from "../../../../components/texts/Caption";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import Tabs, { TabsPage } from "../../../../components/Tabs";
import ActivityList from "../../../../components/activity/List";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Pagination } from "../../../../components/Pagination";
import Bike from "../../../../components/Bike";
import Constants from "expo-constants";
import { useUser } from "../../../../modules/user/useUser";
import { useClient } from "../../../../modules/useClient";
import { GetProfileResponse, GetUserFollowersResponse, GetUserFollowingResponse, createClient, getProfileActivities, getProfileBikes, getProfileById, getUserFollowers, getUserFollowing, setProfileFollow } from "@ridetracker/ridetrackerclient";
import OfflinePageOverlay from "../../../../components/OfflinePageOverlay";
import useInternetConnection from "../../../../modules/useInternetConnection";
import { FontAwesome } from "@expo/vector-icons";
import { setUserData } from "../../../../utils/stores/userData";
import { setClient } from "../../../../utils/stores/client";
import { useDispatch } from "react-redux";
import { LinkText } from "../../../../components/texts/Link";
import Button from "../../../../components/Button";

export default function Profile() {
    const client = useClient();
    const theme = useTheme();
    const userData = useUser();
    const searchParams = useSearchParams();
    const internetConnection = useInternetConnection();
    const dispatch = useDispatch();

    const [ profile, setProfile ] = useState<GetProfileResponse["profile"]>(null);
    const [ follow, setFollow ] = useState<boolean>(null);
    const [ userId, setUserId ] = useState<string>(null);
    const [ uploadingFollow, setUploadingFollow ] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if(searchParams) {
            if(searchParams?.userId)
                setUserId(searchParams.userId.toString());
            else if(userData.user?.id)
                setUserId(userData.user.id);
        }
    }, [ searchParams, userData ]);

    useEffect(() => {
        if(userId) {
            getProfileById(client, userId as string).then((result) => {
                setProfile(result.profile);
                setFollow(result.follow);
            });
        }
    }, [ userId ]);
    
    return (
        <View style={{ flex: 1, paddingVertical: 10, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Profile",
                headerRight: (profile?.user?.id === userData.user?.id)?(() => (
                    <View style={{ marginRight: 20 }}>
                        <TouchableOpacity onPress={() => {
                            dispatch(setUserData({ email: null, token: null }));
                            dispatch(setClient(createClient(Constants.expoConfig.extra.apiUserAgent, Constants.expoConfig.extra.api)));
                        }}>
                            <FontAwesome name="sign-out" size={24} color={theme.color}/>
                        </TouchableOpacity>
                    </View>
                )):(undefined)
            }}/>

            <View style={{                    
                gap: 10,

                alignItems: "center"
            }}>
                <TouchableOpacity disabled={profile?.user?.id !== userData.user?.id} style={{
                    width: 80,
                    aspectRatio: 1,
                    borderRadius: 80,
                    backgroundColor: theme.placeholder,
                    overflow: "hidden"
                }} onPress={() => router.push("/avatar-editor/")}>
                    {(profile?.user?.avatar) && (
                        <Image source={{
                            uri: `${Constants.expoConfig.extra.images}/${profile.user.avatar}/Avatar`
                        }} style={{
                            width: "100%",
                            height: "100%"
                        }}/>
                    )}
                </TouchableOpacity>

                <CaptionText style={(!profile) && {
                    backgroundColor: theme.placeholder,
                    color: "transparent"
                }}>
                    {(profile)?(profile.user.name):("Firstname Lastname")}
                </CaptionText>

                <ParagraphText style={(!profile) && {
                    backgroundColor: theme.placeholder,
                    color: "transparent"
                }}>
                    {(!profile || profile.stats.followers === 0)?("No followers"):(`${profile.stats.followers} followers`)}
                    <Text>     </Text>
                    {(!profile || profile.stats.activities === 0)?("No activities"):(`${profile.stats.activities} activities`)}
                </ParagraphText>

                {(!profile || profile?.user?.id !== userData.user?.id) && (
                    <TouchableOpacity onPress={() => {
                        setUploadingFollow(true);

                        setProfileFollow(client, profile.user.id, !follow).then((result) => {
                            if(result.success)
                                setFollow(result.follow);

                            setUploadingFollow(false);
                        })
                    }}>
                        {(!uploadingFollow)?(
                            <ParagraphText placeholder={follow === null}>
                                <LinkText style={{ fontWeight: "bold" }}>{(follow)?("Unfollow"):("Follow")}</LinkText>
                            </ParagraphText>
                        ):(
                            <ActivityIndicator size={20} color={theme.brand}/>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <Tabs initialTab={"activities"} style={{ flex: 1, paddingBottom: 50 }}>
                <TabsPage id={"activities"} title={"Activities"}>
                    {(profile) && (<ProfileActivities profile={profile}/>)}
                </TabsPage>
                
                <TabsPage id={"bikes"} title={"Bikes"}>
                    {(profile) && (<ProfileBikes profile={profile}/>)}
                </TabsPage>

                {(profile?.user?.id === userData.user.id) && (
                    <TabsPage id={"following"} title={"Following"}>
                        <ProfileFollowing/>
                    </TabsPage>
                )}
                    
                {(profile?.user?.id === userData.user.id) && (
                    <TabsPage id={"followers"} title={"Followers"}>
                        <ProfileFollowers/>
                    </TabsPage>
                )}
            </Tabs>

            {(internetConnection === "OFFLINE") && (
                <OfflinePageOverlay/>
            )}
        </View>
    );
}

type ProfileProp = {
    profile: {
        user: {
            id: string;
        };
    };
};

export function ProfileActivities({ profile }: ProfileProp) {
    const client = useClient();
    const router = useRouter();

    const [ items, setItems ] = useState<string[]>([]);

    return (
        <Pagination style={{ padding: 10, height: "100%" }} items={items} paginate={async (reset) => {
            const result = await getProfileActivities(client, profile.user?.id, (reset)?(0):(items.length));

            if(!result.success)
                return false;

            setItems((reset)?(result.activities):(items.concat(result.activities)));
            
            return (result.activities.length === 5);
        }} render={(activity: string) => (
            <TouchableOpacity key={activity} onPress={() => router.push(`/activities/${activity}`)}>
                <ActivityList id={activity}/>
            </TouchableOpacity>
        )}/>
    );
}

export function ProfileBikes({ profile }: ProfileProp) {
    const client = useClient();
    const router = useRouter();

    const [ items, setItems ] = useState<string[]>([]);

    return (
        <Pagination style={{ padding: 10, height: "100%" }} items={items} paginate={async (reset) => {
            const result = await getProfileBikes(client, profile.user?.id, (reset)?(0):(items.length));

            if(!result.success)
                return false;

            setItems((reset)?(result.bikes):(items.concat(result.bikes)));
            
            return (result.bikes.length === 5);
        }} render={(bike: string) => (
            <TouchableOpacity key={bike} onPress={() => router.push(`/bikes/${bike}`)}>
                <Bike id={bike}/>
            </TouchableOpacity>
        )}/>
    );
};


export function ProfileFollowing() {
    const client = useClient();

    const [ items, setItems ] = useState<GetUserFollowingResponse["following"]>([]);
    const [ offset, setOffset ] = useState<number>(0);

    return (
        <Pagination style={{ padding: 10, height: "100%" }} items={items} paginate={async (reset) => {
            const result = await getUserFollowing(client, (reset)?(0):(offset));

            if(!result.success)
                return false;

            setItems((reset)?(result.following):(items.concat(result.following)));
            setOffset(result.offset);
            
            return (result.following.length === result.limit);
        }} render={(following: GetUserFollowingResponse["following"][0]) => (<ProfileFollowingItem key={following.id} following={following}/>)}/>
    );
};

export type ProfileFollowingItemProps = {
    following: GetUserFollowingResponse["following"][0];
};

export function ProfileFollowingItem({ following }: ProfileFollowingItemProps) {
    const router = useRouter();
    const theme = useTheme();
    const client = useClient();

    const [ follows, setFollows ] = useState<boolean>(true);
    const [ submitting, setSubmitting ] = useState<boolean>(false);

    return (
        <View style={{
            flexDirection: "row",
            gap: 10,

            alignItems: "center"
        }}>
            <TouchableOpacity style={{
                flexDirection: "row",
                gap: 10,

                alignItems: "center"
            }} onPress={() => router.push(`/profile/${following.follow.id}`)}>
                <View style={{
                    height: 40,
                    aspectRatio: 1,
                    
                    backgroundColor: theme.placeholder,
                    
                    borderRadius: 40,
                    overflow: "hidden"
                }}>
                    <Image
                        source={{
                            uri: `${Constants.expoConfig.extra.images}/${following.follow.avatar}/Avatar`
                        }}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}/>
                </View>

                <CaptionText>{following.follow.name}</CaptionText>
            </TouchableOpacity>

            <View style={{ marginLeft: "auto" }}>
                <TouchableOpacity style={{ padding: 10, width: 100, alignItems: "center" }} onPress={() => {
                    setSubmitting(true);

                    setProfileFollow(client, following.follow.id, !follows).then((result) => {
                        if(result.success)
                            setFollows(result.follow);

                        setSubmitting(false);
                    });
                }}>
                    {(!submitting)?(
                        <LinkText style={{ color: (follows)?(theme.red):(theme.brand) }}>{(follows)?("Unfollow"):("Follow")}</LinkText>
                    ):(
                        <ActivityIndicator color={(follows)?(theme.red):(theme.brand)} size={20}/>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};


export function ProfileFollowers() {
    const client = useClient();

    const [ items, setItems ] = useState<GetUserFollowersResponse["followers"]>([]);
    const [ offset, setOffset ] = useState<number>(0);

    return (
        <Pagination style={{ padding: 10, height: "100%" }} items={items} paginate={async (reset) => {
            const result = await getUserFollowers(client, (reset)?(0):(offset));

            if(!result.success)
                return false;

            setItems((reset)?(result.followers):(items.concat(result.followers)));
            setOffset(result.offset);
            
            return (result.followers.length === result.limit);
        }} render={(followers: GetUserFollowersResponse["followers"][0]) => (<ProfileFollowersItem key={followers.id} follower={followers}/>)}/>
    );
};

export type ProfileFollowersItemProps = {
    follower: GetUserFollowersResponse["followers"][0];
};

export function ProfileFollowersItem({ follower }: ProfileFollowersItemProps) {
    const router = useRouter();
    const theme = useTheme();
    const client = useClient();

    const [ follows, setFollows ] = useState<boolean>(follower.followsBack);
    const [ submitting, setSubmitting ] = useState<boolean>(false);

    return (
        <View style={{
            flexDirection: "row",
            gap: 10,

            alignItems: "center"
        }}>
            <TouchableOpacity style={{
                flexDirection: "row",
                gap: 10,

                alignItems: "center"
            }} onPress={() => router.push(`/profile/${follower.follow.id}`)}>
                <View style={{
                    height: 40,
                    aspectRatio: 1,
                    
                    backgroundColor: theme.placeholder,
                    
                    borderRadius: 40,
                    overflow: "hidden"
                }}>
                    <Image
                        source={{
                            uri: `${Constants.expoConfig.extra.images}/${follower.follow.avatar}/Avatar`
                        }}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}/>
                </View>

                <CaptionText>{follower.follow.name}</CaptionText>
            </TouchableOpacity>

            <View style={{ marginLeft: "auto" }}>
                <TouchableOpacity style={{ padding: 10, width: 100, alignItems: "center" }} onPress={() => {
                    setSubmitting(true);

                    setProfileFollow(client, follower.follow.id, !follows).then((result) => {
                        if(result.success)
                            setFollows(result.follow);

                        setSubmitting(false);
                    });
                }}>
                    {(!submitting)?(
                        <LinkText style={{ color: (follows)?(theme.red):(theme.brand) }}>{(follows)?("Unfollow"):("Follow back")}</LinkText>
                    ):(
                        <ActivityIndicator color={(follows)?(theme.red):(theme.brand)} size={20}/>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};
