import { useEffect } from "react";
import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import { useTheme } from "../../../../utils/themes";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useUser } from "../../../../modules/user/useUser";

export default function Layout() {
    const theme = useTheme();

    const userData = useUser();

    return (
        <Tabs screenOptions={{
            headerStyle: {
                backgroundColor: theme.background,
                shadowColor: theme.border
            },

            headerTitleStyle: {
                fontSize: 24,
                fontWeight: "500",
                color: theme.color
            },

            tabBarActiveTintColor: theme.color, 

            tabBarStyle: {
                backgroundColor: theme.background,
                paddingTop: 10,
                paddingBottom: 25,
                borderTopColor: theme.border
            },

            tabBarLabelStyle: {
                fontSize: 14
            }
        }}>
            <Tabs.Screen name="index" options={{
                title: "Feed",
                tabBarIcon: () => (
                    <FontAwesome name="home" color={theme.color} size={24}/>
                )
            }}/>

            <Tabs.Screen name="routes" options={{
                title: "Routes",
                tabBarIcon: () => (
                    <FontAwesome5 name="route" color={theme.color} size={20}/>
                )
            }}/>

            <Tabs.Screen name="record/index" options={{
                title: "Record",

                tabBarStyle: {
                    display: "none"
                },

                tabBarShowLabel: false,
                tabBarLabelStyle: {
                    color: "transparent"
                },

                unmountOnBlur: true,
                
                tabBarIcon: () => (
                    <View style={{ height: 42 }}>
                        <FontAwesome5 name="dot-circle" color={theme.color} size={42}/>
                    </View>
                )
            }}/>

            <Tabs.Screen name="profile" options={{
                title: "Profile",
                href: {
                    pathname: "/profile",
                    params: {
                        userId: userData.user?.id
                    }
                },
                tabBarIcon: () => (
                    <FontAwesome5 name="user-alt" color={theme.color} size={18}/>
                )
            }}/>

            <Tabs.Screen name="settings" options={{
                title: "Settings",
                tabBarIcon: () => (
                    <FontAwesome5 name="cog" color={theme.color} size={21}/>
                )
            }}/>
        </Tabs>
    );
};
