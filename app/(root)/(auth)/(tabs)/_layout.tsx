import { Stack, Tabs } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 

export default function Layout() {
    return (
        <Tabs screenOptions={{
            headerTitleStyle: {
                fontSize: 18
            }
        }}>
            <Tabs.Screen name="index" options={{
                title: "Feed",
                tabBarIcon: () => (<FontAwesome name="home" color={"#444"} size={26}/>)
            }}/>

            <Tabs.Screen name="routes" options={{
                title: "Routes",
                tabBarIcon: () => (<FontAwesome5 name="route" color={"#444"} size={22}/>)
            }}/>

            <Tabs.Screen name="record" options={{
                title: "Record",
                tabBarIcon: () => (<FontAwesome5 name="dot-circle" color={"#444"} size={32}/>)
            }}/>

            <Tabs.Screen name="profile" options={{
                title: "Profile",
                tabBarIcon: () => (<FontAwesome5 name="user-alt" color={"#444"} size={20}/>)
            }}/>

            <Tabs.Screen name="settings" options={{
                title: "Settings",
                tabBarIcon: () => (<FontAwesome5 name="cog" color={"#444"} size={23}/>)
            }}/>

        </Tabs>
    );
};
