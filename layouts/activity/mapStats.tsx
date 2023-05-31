import React, { useState, useEffect } from "react";
import { LayoutRectangle, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityPersonalBest } from "../../components/ActivityPersonalBest";
import { ParagraphText, ParagraphTextFontSize } from "../../components/texts/Paragraph";

type ActivityStatProps = {
    personalBest?: boolean;

    value: string;
    unit?: string;

    type: string;
    altType?: string;
    scale: number;
}

export function ActivityStat({ type, altType, value, unit, personalBest, scale }: ActivityStatProps) {
    return (
        <View style={{ paddingHorizontal: (personalBest)?(scale * 25):(0) }}>
            {(!!personalBest) && (
                <React.Fragment>
                    <ParagraphText style={{ color: "#FFF", textAlign: "center", fontSize: ParagraphTextFontSize * scale }}>Personal Best</ParagraphText>

                    <ActivityPersonalBest scale={scale}/>
                </React.Fragment>
            )}

            <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28 * scale, fontWeight: "500" }}>{value}{(unit) && (<Text style={{ fontSize: 18 * scale }}> {unit}</Text>)}</Text>
            <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16 * scale, paddingHorizontal: 10 * scale }}>{(personalBest && altType)?(altType):(type)}</Text>
        </View>
    );
}

type ActivityMapStatsProps = {
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
    };
};

export default function ActivityMapStats({ activity }: ActivityMapStatsProps) {
    const [ scale, setScale ] = useState<number>(null);
    const [ containerLayout, setContainerLayout ] = useState<LayoutRectangle>(null);
    const [ childLayout, setChildLayout ] = useState<LayoutRectangle>(null);

    useEffect(() => {
        if(!containerLayout || !childLayout || scale !== null)
            return;

        setScale(1 / (childLayout.width / containerLayout.width));
    }, [ containerLayout, childLayout ]);

    if(!activity?.summary)
        return null;

    return (
        <React.Fragment>
            <View style={{ width: "80%" }} onLayout={(event) => setContainerLayout(event.nativeEvent.layout)}/>

            <LinearGradient 
                colors={[ "transparent", "rgba(20, 20, 20, .4)" ]}
                locations={[ 0.5, 1 ]}
                style={{
                    position: "absolute",

                    right: 0,

                    paddingLeft: "20%",
                    paddingBottom: 6,

                    minWidth: "100%",
                    height: "100%",

                    justifyContent: "flex-end",

                    borderRadius: 10,

                }}>
                <View style={{
                    opacity: (scale === null)?(0):(1),


                    flexDirection: "row",
                    
                    justifyContent: "space-between",
                    alignItems: "flex-end"
                }} onLayout={(event) => setChildLayout(event.nativeEvent.layout)}>
                    <ActivityStat scale={scale ?? 1} type="distance" unit="km" value={activity.summary.distance} personalBest={activity.summary.distancePersonalBest}/>
                    <ActivityStat scale={scale ?? 1} type="average speed" altType="avg.speed" unit="km/h" value={activity.summary.averageSpeed} personalBest={activity.summary.averageSpeedPersonalBest}/>
                    <ActivityStat scale={scale ?? 1} type="elevation" unit="m" value={activity.summary.elevation} personalBest={activity.summary.elevationPersonalBest}/>
                </View>
            </LinearGradient>
        </React.Fragment>
    );
}
