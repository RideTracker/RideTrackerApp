import { Text, View } from "react-native";
import { ActivityResponse } from "../../models/activity";

type ActivityStatsProps = {
    activity: ActivityResponse | null;
};

export default function ActivityStats({ activity }: ActivityStatsProps) {
    return (
        <View style={{ gap: 20, padding: 20 }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                    <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}>7.3 km</Text>
                    <Text style={{ textAlign: "center", fontSize: 16 }}>distance</Text>
                </View>
                
                <View style={{ width: "50%" }}>
                    <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}>23.7 km/h</Text>
                    <Text style={{ textAlign: "center", fontSize: 16 }}>average speed</Text>
                </View>
            </View>
            
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                    <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}>33 m</Text>
                    <Text style={{ textAlign: "center", fontSize: 16 }}>elevation</Text>
                </View>
                
                <View style={{ width: "50%" }}>
                    <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}>38.8 km/h</Text>
                    <Text style={{ textAlign: "center", fontSize: 16 }}>max speed</Text>
                </View>
            </View>
        </View>
    );
};
