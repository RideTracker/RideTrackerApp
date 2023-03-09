import { useState, useEffect } from "react";
import { Appearance, RefreshControl, ScrollView, Text, View } from "react-native";
import { Link, Stack } from "expo-router";
import { getFeed } from "../models/feed";
import Error from "../components/error";
import { StatusBar } from "expo-status-bar";
import Empty from "../components/empty";
import ActivityCompact from "../components/activity/compact";
import Footer from "../components/footer";

export default function Routes() {
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFF" }}>
            <Stack.Screen options={{ title: "Routes" }} />

            <View style={{
                flex: 1
            }}>
                <ScrollView></ScrollView>

                <Footer active="/routes"/>
            </View>
        </View>
    );
};
