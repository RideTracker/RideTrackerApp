import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; 
import { useTheme } from "../utils/themes";

export default function TabBarDisabledIcon() {
    const theme = useTheme();

    return (
        <View style={{
            backgroundColor: theme.background,
            
            borderRadius: 16,
            
            width: 16,
            height: 16,

            position: "absolute",

            right: -8,
            top: -4,

            justifyContent: "center",
            alignItems: "center"
        }}>
            <MaterialIcons name="wifi-off" size={14} color={theme.color}/>
        </View>
    );
};
