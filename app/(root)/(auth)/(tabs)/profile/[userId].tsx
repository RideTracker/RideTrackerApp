import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useThemeConfig } from "../../../../../utils/themes";
import { getProfileActivitiesById, getProfileBikesById, getProfileById } from "../../../../../models/user";
import { useSelector } from "react-redux";
import { CaptionText } from "../../../../../components/texts/caption";
import { ParagraphText } from "../../../../../components/texts/paragraph";
import Tabs, { TabsPage } from "../../../../../components/tabs";
import ActivityCompact from "../../../../../components/activity/compact";
import ActivityList from "../../../../../components/activity/list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Pagination } from "../../../../../components/pagination";
import Bike from "../../../../../components/bike";
import Constants from "expo-constants";

export default function Profile() {
    const themeConfig = useThemeConfig();
    const userData = useSelector((state: any) => state.userData);
    useEffect(() => {}, [themeConfig]);

    const { userId } = useSearchParams();

    const [ profile, setProfile ] = useState(null);

    const router = useRouter();

    useEffect(() => {
        async function getProfile() {
            getProfileById(userData.key, userId as string).then((result) => setProfile(result.profile));
        };

        getProfile();
    }, []);
    
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Profile" }} />

            <View style={{
                flex: 1,
                paddingVertical: 10
            }}>
                <View style={{
                    alignItems: "center",
                    gap: 10
                }}>
                    <TouchableOpacity disabled={profile?.user.id !== userData.user.id} style={{
                        width: 80,
                        aspectRatio: 1,
                        borderRadius: 80,
                        backgroundColor: themeConfig.placeholder,
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
                        backgroundColor: themeConfig.placeholder,
                        color: "transparent"
                    }}>
                        {(profile)?(profile.user.name):("Firstname Lastname")}
                    </CaptionText>

                    <ParagraphText style={(!profile) && {
                        backgroundColor: themeConfig.placeholder,
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
        </View>
    );
};

export function ProfileActivities({ profile }) {
    const userData = useSelector((state: any) => state.userData);

    const router = useRouter();

    return (
        <Pagination style={{ padding: 10, height: "100%" }} paginate={async (offset) => {
            const result = await getProfileActivitiesById(userData.key, profile.user.id, offset);
    
            if(!result.success)
                return false;

            return result.activities;
        }} render={(activity) => (
            <TouchableOpacity key={activity} onPress={() => router.push(`/activities/${activity}`)}>
                <ActivityList id={activity}/>
            </TouchableOpacity>
        )}/>
    );
};

export function ProfileBikes({ profile }) {
    const userData = useSelector((state: any) => state.userData);

    const router = useRouter();

    return (
        <Pagination style={{ padding: 10, height: "100%" }} paginate={async (offset) => {
            const result = await getProfileBikesById(userData.key, profile.user.id, offset);
    
            if(!result.success)
                return false;

            return result.bikes;
        }} render={(bike) => (
            <TouchableOpacity key={bike} onPress={() => router.push(`/bikes/${bike}`)}>
                <Bike id={bike}/>
            </TouchableOpacity>
        )}/>
    );
};
