import React, { useState, useEffect } from "react";
import { LayoutRectangle, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityPersonalBest } from "./ActivityPersonalBest";
import { ParagraphText, ParagraphTextFontSize } from "./texts/Paragraph";
import { getFormattedActivitySummary } from "../controllers/getFormattedActivitySummary";

type ActivitySummaryProps = {
    personalBest?: boolean;
    type: string;
    value: number;
    scale: number;
    color?: string;
    contrast?: "white" | "black";
};

export function ActivitySummary({ type, value, personalBest, scale, color, contrast }: ActivitySummaryProps) {
    const [ stat ] = useState(getFormattedActivitySummary(type, value));

    if(!stat)
        return null;

    if(!color)
        color = "white";

    if(!contrast)
        contrast = "white";

    return (
        <View style={{ paddingHorizontal: (personalBest)?(scale * 25):(0) }}>
            {(!!personalBest) && (
                <React.Fragment>
                    <ParagraphText style={{ color, textAlign: "center", fontSize: ParagraphTextFontSize * scale }}>Personal Best</ParagraphText>

                    <ActivityPersonalBest scale={scale} color={contrast}/>
                </React.Fragment>
            )}

            <Text style={{ color, textAlign: "center", fontSize: 28 * scale, fontWeight: "500" }}>{stat.value}{(stat.unit) && (<Text style={{ fontSize: 18 * scale }}> {stat.unit}</Text>)}</Text>
            <Text style={{ color, textAlign: "center", fontSize: 16 * scale, paddingHorizontal: 10 * scale }}>{(personalBest && stat.altName)?(stat.altName):(stat.name)}</Text>
        </View>
    );
};
