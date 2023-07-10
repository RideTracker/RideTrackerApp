import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { useTheme } from "../utils/themes";

export default function TabBarSubscriptionIcon() {
    const theme = useTheme();

    return (
        <View style={{
            backgroundColor: theme.background,
            
            borderRadius: 16,
            
            width: 18,
            height: 18,

            position: "absolute",

            right: -10,
            top: -4,

            justifyContent: "center",
            alignItems: "center"
        }}>
            <Ionicons name="logo-google-playstore" size={14} color={"grey"}/>
        </View>
    );
};
