import { useEffect } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../utils/themes";
import { ActivityPersonalBest } from "../../components/ActivityPersonalBest";

type ActivityStatsProps = {
    activity: any | null;
};

export default function ActivityStats({ activity }: ActivityStatsProps) {
    const theme = useTheme();

    if(!activity) {
        return (
            <View style={{ gap: 20, padding: 20 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                        <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "500", backgroundColor: theme.placeholder, color: "transparent" }}>some km</Text>
                        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: theme.placeholder, color: "transparent" }}>distance</Text>
                    </View>
                    
                    <View style={{ width: "50%" }}>
                        <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "500", backgroundColor: theme.placeholder, color: "transparent" }}>some km/h</Text>
                        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: theme.placeholder, color: "transparent" }}>average speed</Text>
                    </View>
                </View>
                
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                        <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "500", backgroundColor: theme.placeholder, color: "transparent" }}>some m</Text>
                        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: theme.placeholder, color: "transparent" }}>elevation</Text>
                    </View>
                    
                    <View style={{ width: "50%" }}>
                        <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "500", backgroundColor: theme.placeholder, color: "transparent" }}>some km/h</Text>
                        <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: theme.placeholder, color: "transparent" }}>max speed</Text>
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
                    <View style={{ marginLeft: "auto", marginRight: "auto", position: "relative" }}>
                        {(!!activity.summary?.distancePersonalBest) && (<ActivityPersonalBest/>)}

                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.distance} km</Text>
                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 16 }}>distance</Text>
                    </View>
                </View>
                
                <View style={{ width: "50%" }}>
                    <View style={{ marginLeft: "auto", marginRight: "auto", position: "relative" }}>
                        {(!!activity.summary?.averageSpeedPersonalBest) && (<ActivityPersonalBest/>)}

                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.averageSpeed} km/h</Text>
                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 16 }}>average speed</Text>
                    </View>
                </View>
            </View>
            
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                    <View style={{ marginLeft: "auto", marginRight: "auto", position: "relative" }}>
                        {(!!activity.summary?.elevationPersonalBest) && (<ActivityPersonalBest/>)}

                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.elevation} m</Text>
                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 16 }}>elevation</Text>
                    </View>
                </View>
                
                <View style={{ width: "50%" }}>
                    <View style={{ marginLeft: "auto", marginRight: "auto", position: "relative" }}>
                        {(!!activity.summary?.maxSpeedPersonalBest) && (<ActivityPersonalBest/>)}

                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.maxSpeed} km/h</Text>
                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 16 }}>max speed</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
