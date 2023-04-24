import { useEffect } from "react";
import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import { useThemeConfig } from "../../../../utils/themes";
import { View } from "react-native";
import { useSelector } from "react-redux";

export default function Layout() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const userData = useSelector((state: any) => state.userData);

    return (
        <Tabs screenOptions={{
            headerStyle: {
                backgroundColor: themeConfig.background,
                shadowColor: themeConfig.border
            },

            headerTitleStyle: {
                fontSize: 24,
                fontWeight: "500",
                color: themeConfig.color
            },

            tabBarActiveTintColor: themeConfig.color, 

            tabBarStyle: {
                backgroundColor: themeConfig.background,
                paddingTop: 10,
                paddingBottom: 25,
                borderTopColor: themeConfig.border
            },

            tabBarLabelStyle: {
                fontSize: 14
            }
        }}>
            <Tabs.Screen name="index" options={{
                title: "Feed",
                tabBarIcon: () => (
                    <FontAwesome name="home" color={themeConfig.color} size={24}/>
                )
            }}/>

            <Tabs.Screen name="routes" options={{
                title: "Routes",
                tabBarIcon: () => (
                    <FontAwesome5 name="route" color={themeConfig.color} size={20}/>
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
                        <FontAwesome5 name="dot-circle" color={themeConfig.color} size={42}/>
                    </View>
                )
            }}/>

            <Tabs.Screen name="profile" options={{
                title: "Profile",
                href: {
                    pathname: "/profile",
                    params: {
                        userId: userData.user.id
                    }
                },
                tabBarIcon: () => (
                    <FontAwesome5 name="user-alt" color={themeConfig.color} size={18}/>
                )
            }}/>

            <Tabs.Screen name="settings" options={{
                title: "Settings",
                tabBarIcon: () => (
                    <FontAwesome5 name="cog" color={themeConfig.color} size={21}/>
                )
            }}/>
        </Tabs>
    );
};
