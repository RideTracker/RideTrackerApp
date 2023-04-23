import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, Stack, useSearchParams } from "expo-router";
import { getActivityById, getActivitySummaryById } from "../../../../../models/activity";
import Bike from "../../../../../components/bike";
import { useThemeConfig } from "../../../../../utils/themes";
import { useSelector } from "react-redux";
import { HeaderText } from "../../../../../components/texts/header";
import { ParagraphText } from "../../../../../components/texts/paragraph";
import ActivityComment from "../../../../../layouts/activity/comment";

export default function ActivityCommentsPage({ params }) {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);
    
    const router = useRouter();
    const { id } = useSearchParams();

    return (
        <View style={{ flex: 1, backgroundColor: themeConfig.background }}>
            <Stack.Screen options={{ title: "Comments" }} />

            <View style={{ padding: 10 }}>
                <TouchableOpacity onPress={() => router.push(`/activities/${id}/comments`)} style={{ gap: 10 }}>
                    <HeaderText>Comments <Text style={{ fontWeight: "normal" }}>(0)</Text></HeaderText>

                    <ActivityComment comment={null}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};
