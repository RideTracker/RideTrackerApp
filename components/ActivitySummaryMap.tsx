import React, { useState, useEffect } from "react";
import { LayoutRectangle, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivitySummary } from "./ActivitySummary";

type ActivitySummaryMapProps = {
    activity?: {
        summary?: {
            key: string;
            value: number;
            personalBest?: boolean;
        }[];
    };
};

export default function ActivitySummaryMap({ activity }: ActivitySummaryMapProps) {
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
                    paddingRight: 6,

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
                    {activity.summary.sort((a, b) => (a.personalBest)?(1):(0)).slice(0, (activity.summary.filter((activitySummary) => activitySummary.personalBest).length)?(3):(4)).map((activitySummary) => (
                        <ActivitySummary key={activitySummary.key} scale={scale ?? 1} type={activitySummary.key} value={activitySummary.value} personalBest={activitySummary.personalBest}/>
                    ))}
                </View>
            </LinearGradient>
        </React.Fragment>
    );
}
