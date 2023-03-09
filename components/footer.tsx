import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons"; 

import * as Constants from "expo-constants";
import { useRouter } from "expo-router";

type FooterProps = {
    active: string;

    style?: any;
};

export default function Footer({ active, style }: FooterProps) {
    const router = useRouter();

    const pages = [
        {
            text: "Feed",
            icon: (<FontAwesome name="home" size={28} color="black"/>),
            link: "/"
        },
        
        {
            text: "Routes",
            icon: (<FontAwesome5 name="route" size={24} color="black"/>),
            link: "/routes"
        },
        
        {
            text: "Record",
            icon: (<FontAwesome5 name="dot-circle" size={32} color="black"/>),
            link: "/record"
        },
        
        {
            text: "Profile",
            icon: (<FontAwesome5 name="user-alt" size={22} color="black"/>),
            link: "/profile"
        },
        
        {
            text: "Settings",
            icon: (<FontAwesome5 name="cog" size={23} color="black"/>),
            link: "/settings"
        }
    ];

    return (
        <View style={style}>
            <View style={{
                paddingBottom: 15,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",

                borderTopColor: "#EEE",
                borderTopWidth: 1
            }}>
                {(pages.map((page) => (
                    <TouchableOpacity key={page.link} style={{ padding: 10 }} onPress={() => router.replace(page.link)}>
                        {page.icon}
                    </TouchableOpacity>
                )))}
            </View>
        </View>
    );
};
