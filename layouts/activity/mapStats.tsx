import React from "react";
import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function ActivityMapStatsPersonalBest() {
    return (
        <React.Fragment>
            <Image source={require("../../assets/images/laurel-wreath.png")} style={{
                position: "absolute",
                
                left: -28,
                bottom: -4,

                width: 50,
                height: 50,
            }} resizeMode="contain"/>

            <Image source={require("../../assets/images/laurel-wreath.png")} style={{
                position: "absolute",
                
                right: -28,
                bottom: -4,

                transform: [
                    {
                        rotateY: "180deg"
                    }
                ],

                width: 50,
                height: 50,
            }} resizeMode="contain"/>
        </React.Fragment>
    );
};

export default function ActivityMapStats({ activity }) {
    if(!activity?.summary)
        return null;

    return (
        <LinearGradient 
            colors={[ "transparent", "rgba(20, 20, 20, .4)" ]}
            locations={[ 0.5, 1 ]}
            style={{
            position: "absolute",

            right: 0,

            width: "100%",
            paddingRight: "5%",
            paddingLeft: "20%",
            paddingBottom: 8,
            height: "100%",

            borderRadius: 10,
            gap: 10,

            alignItems: "flex-end",

            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <View>
                {(!!activity.summary?.distancePersonalBest) && (<ActivityMapStatsPersonalBest/>)}

                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.distance}<Text style={{ fontSize: 18 }}> km</Text></Text>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16, paddingHorizontal: 10 }}>distance</Text>
            </View>
            
            <View>
                {(!!activity.summary?.averageSpeedPersonalBest) && (<ActivityMapStatsPersonalBest/>)}
                
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.averageSpeed}<Text style={{ fontSize: 18 }}> km/h</Text></Text>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16, paddingHorizontal: 5 }}>average speed</Text>
            </View>
            
            <View>
                {(!!activity.summary?.elevationPersonalBest) && (<ActivityMapStatsPersonalBest/>)}
                
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28, fontWeight: "500" }}>{activity.summary.elevation}<Text style={{ fontSize: 18 }}> m</Text></Text>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16 }}>elevation</Text>
            </View>
        </LinearGradient>
    );
};
