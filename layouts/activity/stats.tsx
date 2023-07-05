import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../utils/themes";
import { ActivitySummary } from "../../components/ActivitySummary";

type ActivityStatsProps = {
    activity?: {
        summary?: {
            key: string;
            value: number;
            personalBest: boolean;
        }[];
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
        <View style={{
            flexDirection: "row",
            flexWrap: "wrap",

            paddingBottom: 10
        }}>
            {activity.summary.map((activitySummary) => (
                <View key={activitySummary.key} style={{ width: "50%", marginVertical: 10 }}>
                    <View style={{ alignSelf: "center" }}>
                       <ActivitySummary color={theme.color} scale={1} type={activitySummary.key} value={activitySummary.value} personalBest={activitySummary.personalBest}/>
                    </View>
                </View>
            ))}
        </View>
    );
}
