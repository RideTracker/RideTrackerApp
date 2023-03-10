import { useEffect } from "react";
import { Text, View } from "react-native";
import { ActivityResponse } from "../../models/activity";
import { useThemeConfig } from "../../utils/themes";

type ActivityStatsProps = {
    activity: ActivityResponse | null;
};

export default function ActivityStats({ activity }: ActivityStatsProps) {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);
    
    return (
        <View style={{ gap: 20, padding: 20 }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>7.3 km</Text>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 16 }}>distance</Text>
                </View>
                
                <View style={{ width: "50%" }}>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>23.7 km/h</Text>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 16 }}>average speed</Text>
                </View>
            </View>
            
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>33 m</Text>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 16 }}>elevation</Text>
                </View>
                
                <View style={{ width: "50%" }}>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>38.8 km/h</Text>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 16 }}>max speed</Text>
                </View>
            </View>
        </View>
    );
};
