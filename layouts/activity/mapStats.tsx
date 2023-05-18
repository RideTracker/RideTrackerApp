import React, { useState, useEffect } from "react";
import { Dimensions, Image, LayoutRectangle, PixelRatio, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityPersonalBest } from "../../components/ActivityPersonalBest";
import { ParagraphText, ParagraphTextFontSize } from "../../components/texts/paragraph";

type ActivityStatProps = {
    personalBest?: boolean;

    value: string;
    unit?: string;

    type: string;
    altType?: string;
    fontSizeScale: number;
}

export function ActivityStat(props: ActivityStatProps) {
    const { type, altType, value, unit, personalBest, fontSizeScale } = props;

    return (
        <View style={{ marginLeft: "auto", marginRight: "auto", marginTop: "auto", paddingHorizontal: (personalBest)?(fontSizeScale * 20):(0) }}>
            {(!!personalBest) && (
                <React.Fragment>
                    <ParagraphText style={{ textAlign: "center", fontSize: ParagraphTextFontSize * fontSizeScale }}>Personal Best</ParagraphText>

                    <ActivityPersonalBest fontSizeScale={fontSizeScale}/>
                </React.Fragment>
            )}

            <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28 * fontSizeScale, fontWeight: "500" }}>{value}{(unit) && (<Text style={{ fontSize: 18 * fontSizeScale }}> {unit}</Text>)}</Text>
            <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16 * fontSizeScale, paddingHorizontal: 10 }}>{(personalBest && altType)?(altType):(type)}</Text>
        </View>
    );
};

export default function ActivityMapStats({ activity }) {
    const [ fontSizeScale, setFontSizeScale ] = useState<number>(null);
    const [ containerLayout, setContainerLayout ] = useState<LayoutRectangle>(null);
    const [ childLayout, setChildLayout ] = useState<LayoutRectangle>(null);

    useEffect(() => {
        if(!containerLayout || !childLayout || fontSizeScale !== null)
            return;

            console.log("update", fontSizeScale);

        console.log("child", childLayout);
        console.log("container", containerLayout);

        if(childLayout.width > containerLayout.width)
            setFontSizeScale(1 / (childLayout.width / containerLayout.width));
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

                borderRadius: 10,

                alignItems: "flex-end",

                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <View style={{
                    opacity: (fontSizeScale === null)?(0):(1),

                    flexDirection: "row"
                }} onLayout={(event) => setChildLayout(event.nativeEvent.layout)}>
                    <View>
                        <ActivityStat fontSizeScale={fontSizeScale ?? 1} type="distance" unit="km" value={activity.summary.distance} personalBest={activity.summary.distancePersonalBest}/>
                    </View>

                    <View>
                        <ActivityStat fontSizeScale={fontSizeScale ?? 1} type="average speed" altType="avg.speed" unit="km/h" value={activity.summary.averageSpeed} personalBest={activity.summary.averageSpeedPersonalBest}/>
                    </View>

                    <View>
                        <ActivityStat fontSizeScale={fontSizeScale ?? 1} type="elevation" unit="m" value={activity.summary.elevation} personalBest={activity.summary.elevationPersonalBest}/>
                    </View>
                </View>
            </LinearGradient>
        </React.Fragment>
    );
};
