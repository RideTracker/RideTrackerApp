import React from "react";
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

type TabBarProps = {
    state: State;
    insets: EdgeInsets;
};

// TODO: self-explanatory, create components, use an array.

export default function TabBar(props: TabBarProps) {
    const { state, insets } = props;

    const theme = useTheme();
    const userData = useUser();
    const internetConnection = useInternetConnection();

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
            paddingTop: 12,

            borderTopColor: theme.border,
            borderTopWidth: 1,

            justifyContent: "space-evenly",

            alignItems: "flex-start",

            backgroundColor: theme.background
        }}>
            <Link asChild={true} style={{ width: "25%", textAlign: "center" }} href="/">
                <TouchableOpacity disabled={internetConnection === "OFFLINE"}>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <View style={{ position: "relative" }}>
                            <FontAwesome style={{ height: 24 }} name="home" color={(internetConnection !== "OFFLINE")?((current == "index")?(theme.brand):(theme.color)):("grey")} size={24}/>

                            {(internetConnection === "OFFLINE") && (
                                <TabBarDisabledIcon/>
                            )}
                        </View>

                        <ParagraphText style={{ fontSize: 14, color: (internetConnection !== "OFFLINE")?((current == "index")?(theme.brand):(theme.color)):("grey") }}>Feed</ParagraphText>
                    </View>
                </TouchableOpacity>
            </Link>
            
            <Link asChild={true} style={{ width: "25%", textAlign: "center" }} href={("/routes")}>
                <TouchableOpacity disabled={internetConnection === "OFFLINE"}>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <View style={{ position: "relative" }}>
                            <FontAwesome5 style={{ height: 24 }} name="route" color={(internetConnection !== "OFFLINE")?((current == "routes")?(theme.brand):(theme.color)):("grey")} size={20}/>
                            
                            {(internetConnection === "OFFLINE") && (
                                <TabBarDisabledIcon/>
                            )}
                        </View>

                        <ParagraphText style={{ fontSize: 14, color: (internetConnection !== "OFFLINE")?((current == "routes")?(theme.brand):(theme.color)):("grey") }}>Routes</ParagraphText>
                    </View>
                </TouchableOpacity>
            </Link>
            
            <Link asChild={true} style={{ width: "25%", textAlign: "center", alignItems: "center" }} href={("/record")} replace={true}>
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
                <TouchableOpacity disabled={internetConnection === "OFFLINE"}>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <View style={{ position: "relative" }}>
                            <FontAwesome5 style={{ height: 24 }} name="user-alt" color={(internetConnection !== "OFFLINE")?((current == "profile")?(theme.brand):(theme.color)):("grey")} size={18}/>
                            
                            {(internetConnection === "OFFLINE") && (
                                <TabBarDisabledIcon/>
                            )}
                        </View>

                        <ParagraphText style={{ fontSize: 14, color: (internetConnection !== "OFFLINE")?((current == "profile")?(theme.brand):(theme.color)):("grey") }}>Profile</ParagraphText>
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
