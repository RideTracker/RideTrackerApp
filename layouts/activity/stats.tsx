import { useEffect } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../utils/themes";
import { ActivityPersonalBest } from "../../components/ActivityPersonalBest";
import { ParagraphText } from "../../components/texts/paragraph";

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
                <View style={{ width: "50%", gap: 5 }}>
                    <View style={{ marginLeft: "auto", marginRight: "auto", position: "relative", paddingHorizontal: 10 }}>
                        {(!!activity.summary?.distancePersonalBest) && (<ActivityPersonalBest/>)}

                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.distance} km</Text>
                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 16 }}>distance</Text>
                    </View>
                    
                    {(!!activity.summary?.distancePersonalBest) && (<ParagraphText style={{ textAlign: "center" }}>Personal Best</ParagraphText>)}
                </View>
                
                <View style={{ width: "50%", gap: 5 }}>
                    <View style={{ marginLeft: "auto", marginRight: "auto", position: "relative", paddingHorizontal: 10 }}>
                        {(!!activity.summary?.averageSpeedPersonalBest) && (<ActivityPersonalBest/>)}

                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.averageSpeed} km/h</Text>
                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 16 }}>{(!!activity.summary?.averageSpeedPersonalBest)?("avg.speed"):("average speed")}</Text>
                    </View>
                    
                    {(!!activity.summary?.averageSpeedPersonalBest) && (<ParagraphText style={{ textAlign: "center" }}>Personal Best</ParagraphText>)}
                </View>
            </View>
            
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%", gap: 5 }}>
                    <View style={{ marginLeft: "auto", marginRight: "auto", position: "relative", paddingHorizontal: 10 }}>
                        {(!!activity.summary?.elevationPersonalBest) && (<ActivityPersonalBest/>)}

                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.elevation} m</Text>
                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 16 }}>elevation</Text>
                    </View>
                    
                    {(!!activity.summary?.elevationPersonalBest) && (<ParagraphText style={{ textAlign: "center" }}>Personal Best</ParagraphText>)}
                </View>
                
                <View style={{ width: "50%", gap: 5 }}>
                    <View style={{ marginLeft: "auto", marginRight: "auto", position: "relative", paddingHorizontal: 10 }}>
                        {(!!activity.summary?.maxSpeedPersonalBest) && (<ActivityPersonalBest/>)}

                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.maxSpeed} km/h</Text>
                        <Text style={{ color: theme.color, textAlign: "center", fontSize: 16 }}>max speed</Text>
                    </View>
                    
                    {(!!activity.summary?.maxSpeedPersonalBest) && (<ParagraphText style={{ textAlign: "center" }}>Personal Best</ParagraphText>)}
                </View>
            </View>
        </View>
    );
};
