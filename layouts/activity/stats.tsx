import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../utils/themes";
import { ActivityStat } from "./mapStats";

type ActivityStatsProps = {
    activity?: {
        summary?: {
            distance: string;
            distancePersonalBest?: boolean;
            
            averageSpeed: string;
            averageSpeedPersonalBest?: boolean;
            
            elevation: string;
            elevationPersonalBest?: boolean;
            
            maxSpeed: string;
            maxSpeedPersonalBest?: boolean;
        };
    } | null;
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
                <View style={{ width: "50%", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <ActivityStat scale={1} type="distance" unit="km" value={activity.summary.distance} personalBest={activity.summary.distancePersonalBest}/>
                    </View>
                </View>
                
                <View style={{ width: "50%", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <ActivityStat scale={1} type="average speed" altType="avg.speed" unit="km/h" value={activity.summary.averageSpeed} personalBest={activity.summary.averageSpeedPersonalBest}/>
                    </View>
                </View>
            </View>
            
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <ActivityStat scale={1} type="elevation" unit="m" value={activity.summary.elevation} personalBest={activity.summary.elevationPersonalBest}/>
                    </View>
                </View>
                
                <View style={{ width: "50%", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <ActivityStat scale={1} type="max speed" unit="km/h" value={activity.summary.maxSpeed} personalBest={activity.summary.maxSpeedPersonalBest}/>
                    </View>
                </View>
            </View>
        </View>
    );
}
