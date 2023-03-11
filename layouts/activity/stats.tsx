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

    if(!activity) {
        return (
            <View style={{ gap: 20, padding: 20 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                        <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "500", backgroundColor: themeConfig.placeholder, color: "transparent" }}>some km</Text>
                        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: themeConfig.placeholder, color: "transparent" }}>distance</Text>
                    </View>
                    
                    <View style={{ width: "50%" }}>
                        <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "500", backgroundColor: themeConfig.placeholder, color: "transparent" }}>some km/h</Text>
                        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: themeConfig.placeholder, color: "transparent" }}>average speed</Text>
                    </View>
                </View>
                
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                        <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "500", backgroundColor: themeConfig.placeholder, color: "transparent" }}>some m</Text>
                        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: themeConfig.placeholder, color: "transparent" }}>elevation</Text>
                    </View>
                    
                    <View style={{ width: "50%" }}>
                        <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "500", backgroundColor: themeConfig.placeholder, color: "transparent" }}>some km/h</Text>
                        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: themeConfig.placeholder, color: "transparent" }}>max speed</Text>
                    </View>
                </View>
            </View>
        );
    }

    if(!activity.summary)
        return null;
    
    return (
        <View style={{ gap: 20, padding: 20 }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.distance} km</Text>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 16 }}>distance</Text>
                </View>
                
                <View style={{ width: "50%" }}>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.averageSpeed} km/h</Text>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 16 }}>average speed</Text>
                </View>
            </View>
            
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.elevation} m</Text>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 16 }}>elevation</Text>
                </View>
                
                <View style={{ width: "50%" }}>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.maxSpeed} km/h</Text>
                    <Text style={{ color: themeConfig.color, textAlign: "center", fontSize: 16 }}>max speed</Text>
                </View>
            </View>
        </View>
    );
};
