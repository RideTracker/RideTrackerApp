import React from "react";
import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityPersonalBest } from "../../components/ActivityPersonalBest";
import { ParagraphText } from "../../components/texts/paragraph";

type ActivityStatProps = {
    personalBest?: boolean;

    value: string;
    unit?: string;

    type: string;
    altType?: string;
}

export function ActivityStat(props: ActivityStatProps) {
    const { type, altType, value, unit, personalBest } = props;

    return (
        <View style={{ marginLeft: "auto", marginRight: "auto", marginTop: "auto" }}>
            {(!!personalBest) && (
                <React.Fragment>
                    <ParagraphText style={{ textAlign: "center" }}>Personal Best</ParagraphText>

                    <ActivityPersonalBest/>
                </React.Fragment>
            )}

            <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28, fontWeight: "500" }}>{value}{(unit) && (<Text style={{ fontSize: 18 }}> {unit}</Text>)}</Text>
            <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16, paddingHorizontal: 10 }}>{(personalBest && altType)?(altType):(type)}</Text>
        </View>
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
            <ActivityStat type="distance" unit="km" value={activity.summary.distance} personalBest={activity.summary.distancePersonalBest}/>
            <ActivityStat type="average speed" altType="avg.speed" unit="km/h" value={activity.summary.averageSpeed} personalBest={activity.summary.averageSpeedPersonalBest}/>
            <ActivityStat type="elevation" unit="m" value={activity.summary.elevation} personalBest={activity.summary.elevationPersonalBest}/>
        </LinearGradient>
    );
};
