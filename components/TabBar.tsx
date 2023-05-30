import React from "react";
import { View, TouchableOpacity } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { useTheme } from "../utils/themes";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import { ParagraphText } from "./texts/Paragraph";
import { useUser } from "../modules/user/useUser";
import { Link } from "expo-router";
import { State } from "expo-router/src/fork/getPathFromState";

type TabBarProps = {
    state: State;
    insets: EdgeInsets;
};

export default function TabBar(props: TabBarProps) {
    const { state, insets } = props;

    const theme = useTheme();
    const userData = useUser();

    const current = state.routes[state.index].name;

    if(current == "record/index")
        return (null);

    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            
            paddingHorizontal: 10,
            paddingVertical: 10,
            paddingBottom: Math.max(5, insets.bottom),

            justifyContent: "space-evenly",

            alignItems: "flex-start",

            backgroundColor: theme.background
        }}>
            <Link asChild={true} style={{ width: "25%", textAlign: "center" }} href="/">
                <TouchableOpacity>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <FontAwesome style={{ height: 24 }} name="home" color={(current == "index")?(theme.brand):(theme.color)} size={24}/>

                        <ParagraphText style={{ fontSize: 14, color: (current == "index")?(theme.brand):(theme.color) }}>Feed</ParagraphText>
                    </View>
                </TouchableOpacity>
            </Link>
            
            <Link asChild={true} style={{ width: "25%", textAlign: "center" }} href={("/routes")}>
                <TouchableOpacity>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <FontAwesome5 style={{ height: 24 }} name="route" color={(current == "routes")?(theme.brand):(theme.color)} size={20}/>

                        <ParagraphText style={{ fontSize: 14, color: (current == "routes")?(theme.brand):(theme.color) }}>Routes</ParagraphText>
                    </View>
                </TouchableOpacity>
            </Link>
            
            <Link asChild={true} style={{ width: "25%", textAlign: "center", alignItems: "center" }} href={("/record")}>
                <TouchableOpacity>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <FontAwesome5 name="dot-circle" color={(current == "record")?(theme.brand):(theme.color)} size={44} style={{ marginTop: -5 }}/>
                    </View>
                </TouchableOpacity>
            </Link>

            <Link asChild={true} style={{ width: "25%", textAlign: "center" }} href={{
                pathname: "/profile",
                params: {
                    userId: userData.user?.id
                }
            }}>
                <TouchableOpacity>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <FontAwesome5 style={{ height: 24 }} name="user-alt" color={(current == "profile")?(theme.brand):(theme.color)} size={18}/>

                        <ParagraphText style={{ fontSize: 14, color: (current == "profile")?(theme.brand):(theme.color) }}>Profile</ParagraphText>
                    </View>
                </TouchableOpacity>
            </Link>
            
            <Link asChild={true} style={{ width: "25%", textAlign: "center" }} href={("/settings")}>
                <TouchableOpacity>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <FontAwesome5 style={{ height: 24 }} name="cog" color={(current == "settings")?(theme.brand):(theme.color)} size={21}/>

                        <ParagraphText style={{ fontSize: 14, color: (current == "settings")?(theme.brand):(theme.color) }}>Settings</ParagraphText>
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
