import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
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
import { createClient, getProfileActivities, getProfileBikes, getProfileById } from "@ridetracker/ridetrackerclient";
import OfflinePageOverlay from "../../../../components/OfflinePageOverlay";
import useInternetConnection from "../../../../modules/useInternetConnection";
import { FontAwesome } from "@expo/vector-icons";
import { setUserData } from "../../../../utils/stores/userData";
import { setClient } from "../../../../utils/stores/client";
import { useDispatch } from "react-redux";

export default function Profile() {
    const client = useClient();
    const theme = useTheme();
    const userData = useUser();
    const searchParams = useSearchParams();
    const internetConnection = useInternetConnection();
    const dispatch = useDispatch();

    const [ profile, setProfile ] = useState(null);
    const [ userId, setUserId ] = useState<string>(null);

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
            getProfileById(client, userId as string).then((result) => setProfile(result.profile));
        }
    }, [ userId ]);
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background }}>
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
                flex: 1,
                paddingVertical: 10
            }}>
                <View style={{
                    alignItems: "center",
                    gap: 10
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
                </View>

                <Tabs initialTab={"activities"} style={{ marginTop: 10 }}>
                    <TabsPage id={"activities"} title={"Activities"}>
                        {(profile) && (<ProfileActivities profile={profile}/>)}
                    </TabsPage>
                    
                    <TabsPage id={"bikes"} title={"Bikes"}>
                        {(profile) && (<ProfileBikes profile={profile}/>)}
                    </TabsPage>
                </Tabs>
            </View>

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
            <TouchableOpacity onPress={() => router.push(`/activities/${activity}`)}>
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
            <TouchableOpacity onPress={() => router.push(`/bikes/${bike}`)}>
                <Bike id={bike}/>
            </TouchableOpacity>
        )}/>
    );
}
