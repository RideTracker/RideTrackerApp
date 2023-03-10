import { useEffect } from "react";
import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import { useThemeConfig } from "../../../../utils/themes";

export default function Layout() {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

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
                paddingTop: 15,
                backgroundColor: themeConfig.background
            }
        }}>
            <Tabs.Screen name="index" options={{
                title: "Feed",
                tabBarIcon: () => (<FontAwesome name="home" color={themeConfig.color} size={26}/>)
            }}/>

            <Tabs.Screen name="routes" options={{
                title: "Routes",
                tabBarIcon: () => (<FontAwesome5 name="route" color={themeConfig.color} size={22}/>)
            }}/>

            <Tabs.Screen name="record" options={{
                title: "Record",
                tabBarIcon: () => (<FontAwesome5 name="dot-circle" color={themeConfig.color} size={32}/>)
            }}/>

            <Tabs.Screen name="profile" options={{
                title: "Profile",
                tabBarIcon: () => (<FontAwesome5 name="user-alt" color={themeConfig.color} size={20}/>)
            }}/>

            <Tabs.Screen name="settings" options={{
                title: "Settings",
                tabBarIcon: () => (<FontAwesome5 name="cog" color={themeConfig.color} size={23}/>)
            }}/>
        </Tabs>
    );
};
