import React, { ReactNode, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { useTheme } from "../utils/themes";
import { MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import { ParagraphText } from "./texts/Paragraph";
import { useUser } from "../modules/user/useUser";
import { Link } from "expo-router";
import { State } from "expo-router/src/fork/getPathFromState";
import useInternetConnection from "../modules/useInternetConnection";
import TabBarDisabledIcon from "./TabBarDisabledIcon";
import TabBarSubscriptionIcon from "./TabBarSubscriptionIcon";

type TabBarProps = {
    state: State;
    insets: EdgeInsets;
};

export const pages: {
    key: string;
    title?: string;
    href: string;
    replace: boolean;
    icon: (current: string, color: string) => ReactNode;
    requiresInternetConnection: boolean;
    requiresSubscription?: boolean;
}[] = [
    {
        key: "index",
        title: "Feed",
        href: "/",
        replace: false,
        icon: (current, color) => (
            <FontAwesome style={{ height: 24 }} name="home" color={color} size={24}/>
        ),
        requiresInternetConnection: true
    },

    {
        key: "(subscription)/routes",
        title: "Routes",
        href: "/routes",
        replace: false,
        icon: (current, color) => (
            <FontAwesome5 style={{ height: 24 }} name="route" color={color} size={20}/>
        ),
        requiresInternetConnection: true,
        requiresSubscription: true
    },

    {
        key: "record",
        href: "/record",
        replace: true,
        icon: (current, color) => (
            <FontAwesome5 name="dot-circle" color={color} size={44} style={{ marginTop: -5 }}/>
        ),
        requiresInternetConnection: false
    },

    {
        key: "profile",
        title: "Profile",
        href: "/profile",
        replace: false,
        icon: (current, color) => (
            <FontAwesome5 style={{ height: 24 }} name="user-alt" color={color} size={18}/>
        ),
        requiresInternetConnection: true
    },

    {
        key: "settings",
        title: "Settings",
        href: "/settings",
        replace: false,
        icon: (current, color) => (
            <FontAwesome5 style={{ height: 24 }} name="cog" color={color} size={21}/>
        ),
        requiresInternetConnection: false
    }
];

export default function TabBar(props: TabBarProps) {
    const { state, insets } = props;

    const theme = useTheme();
    const userData = useUser();
    const internetConnection = useInternetConnection();

    const current = state.routes[state.index].name;

    if(current == "record/index")
        return (null);

    function getPageColor(page: typeof pages[0]) {
        if(page.requiresInternetConnection && internetConnection === "OFFLINE")
            return "grey";
            
        if(page.requiresSubscription && !userData.user?.subscribed)
            return "grey";
        
        if(current == page.key)
            return theme.brand;
        
        return theme.color;
    };

    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            
            paddingHorizontal: 10,
            paddingVertical: 10,
            paddingBottom: Math.max(5, insets.bottom),
            paddingTop: 12,

            borderTopColor: theme.border,
            borderTopWidth: 1,

            justifyContent: "space-evenly",

            alignItems: "flex-start",

            backgroundColor: theme.background
        }}>
            {pages.map((page) => (
                <Link key={page.key} asChild={true} style={{ width: "25%", textAlign: "center" }} href={(page.requiresSubscription && !userData.user?.subscribed)?("/subscriptions/list"):(page.href)}>
                    <TouchableOpacity>
                        <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <View style={{ position: "relative" }}>
                                {page.icon(current, getPageColor(page))}

                                {(page.requiresInternetConnection && internetConnection === "OFFLINE")?(
                                    <TabBarDisabledIcon/>
                                ):((page.requiresSubscription && !userData.user?.subscribed) && (
                                    <TabBarSubscriptionIcon/>
                                ))}
                            </View>

                            {(page.title) && (
                                <ParagraphText style={{ fontSize: 14, color: getPageColor(page) }}>{page.title}</ParagraphText>
                            )}
                        </View>
                    </TouchableOpacity>
                </Link>
            ))}
        </View>
    );
}
