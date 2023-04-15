import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Stack, useSearchParams } from "expo-router";
import { useThemeConfig } from "../../../../../utils/themes";
import { getProfileById } from "../../../../../models/user";
import { useSelector } from "react-redux";
import { CaptionText } from "../../../../../components/texts/caption";
import { ParagraphText } from "../../../../../components/texts/paragraph";

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
                <ScrollView>
                    <View style={{
                        alignItems: "center",
                        gap: 10
                    }}>
                        <View style={{
                            width: 100,
                            aspectRatio: 1,
                            borderRadius: 100,
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
                            {(!profile || profile.stats.activities === 0)?("No activities"):(`${profile.stats.followers} activities`)}
                        </ParagraphText>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};
