import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Stack, useSearchParams } from "expo-router";
import { useThemeConfig } from "../../../../../utils/themes";
import { getProfileActivitiesById, getProfileById } from "../../../../../models/user";
import { useSelector } from "react-redux";
import { CaptionText } from "../../../../../components/texts/caption";
import { ParagraphText } from "../../../../../components/texts/paragraph";
import Tabs, { TabsPage } from "../../../../../components/tabs";
import ActivityCompact from "../../../../../components/activity/compact";
import ActivityList from "../../../../../components/activity/list";

export default function Profile() {
    const themeConfig = useThemeConfig();
    const userData = useSelector((state: any) => state.userData);
    useEffect(() => {}, [themeConfig]);

    const { userId } = useSearchParams();

    const [ profile, setProfile ] = useState(null);

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
                    <View style={{
                        width: 80,
                        aspectRatio: 1,
                        borderRadius: 80,
                        backgroundColor: themeConfig.placeholder,
                        overflow: "hidden"
                    }}>
                        {(profile?.user?.avatar) && (
                            <Image source={{
                                uri: profile.user.avatar
                            }} style={{
                                width: "100%",
                                height: "100%"
                            }}/>
                        )}
                    </View>

                    
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
                        <ProfileActivities profile={profile}/>
                    </TabsPage>
                    
                    <TabsPage id={"bikes"} title={"Bikes"}>
                        <ParagraphText>bikes page</ParagraphText>
                    </TabsPage>
                </Tabs>
            </View>
        </View>
    );
};

export function ProfileActivities({ profile }) {
    const userData = useSelector((state: any) => state.userData);

    const [ activities, setActivities ] = useState([]);
    const [ offset, setOffset ] = useState(0);

    useEffect(() => {
        if(!profile)
            return;

        async function getActivities() {
            const result = await getProfileActivitiesById(userData.key, profile.user.id, offset);

            if(!result.success)
                return;

            setOffset(result.offset);
            setActivities(activities.concat(result.activities));
        };

        getActivities();
    }, [ profile ]);

    return (
        <ScrollView style={{ padding: 10 }}>
            <View style={{ gap: 10 }}>
                {activities.map((activity) => (
                    <ActivityList key={activity} id={activity}/>
                ))}
            </View>
        </ScrollView>
    );
};
