import React, { useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, Text, TouchableOpacity } from "react-native";
import ActivityDataMap from "./ActivityDataMap";
import { getActivitySessionsInsights, GetActivitySessionsInsightsResponse } from "@ridetracker/routeclient";
import { useRoutesClient } from "../../modules/useRoutesClient";
import getClosestCoordinate from "../../controllers/polylines/getClosestCoordinate";
import { ParagraphText } from "../texts/Paragraph";
import { useUser } from "../../modules/user/useUser";
import { useTheme } from "../../utils/themes";
import Graph, { GraphDatasetPoints } from "../Graph";
import getFormattedDuration from "../../controllers/getFormattedDuration";
import GraphPoint from "../GraphPoint";
import { CaptionText } from "../texts/Caption";
import ActivityDataMapGradient from "./ActivityDataMapGradient";
import { css } from "chroma.ts";
import ActivityDataMapSolids from "./ActivityDataMapSolids";

export type ActivityInsightsProps = {
    activity: {
        id: string;
    };
};

export default function ActivityInsights({ activity }: ActivityInsightsProps) {
    const routesClient = useRoutesClient();
    const userData = useUser();
    const theme = useTheme();

    const [ dataMap, setDataMap ] = useState<"speed" | "altitude">("speed");
    const [ insights, setInsights ] = useState<GetActivitySessionsInsightsResponse["insights"]>(null);
    const [ batteryDatasetPoints, setBatteryDatasetPoints ] = useState<GraphDatasetPoints[]>([]);
    const [ selectedBatteryPoint, setSelectedBatteryPoint ] = useState<GraphDatasetPoints["points"][0]>(null);

    useEffect(() => {
        if(activity) {
            getActivitySessionsInsights(routesClient, activity.id).then((result) => {
                if(result.success) {
                    setInsights(result.insights);
                } 
            });
        }
    }, [ activity ]);

    return (
        <React.Fragment>
            <View>
                <View style={{ height: 200 }}>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity disabled={dataMap === "speed"} onPress={() => setDataMap("speed")}>
                            <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", fontSize: 24, color: (dataMap === "speed")?(theme.color):("grey") }}>Speed</ParagraphText>
                        </TouchableOpacity>

                        <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", fontWeight: "bold", fontSize: 24, color: "grey" }}> / </ParagraphText>

                        <TouchableOpacity disabled={dataMap === "altitude"} onPress={() => setDataMap("altitude")}>
                            <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", fontSize: 24, color: (dataMap === "altitude")?(theme.color):("grey") }}>Elevation</ParagraphText>
                        </TouchableOpacity>
                    </View>

                    <ActivityDataMap activity={activity} sessions={(dataMap === "speed")?(insights?.speed?.polylines):(insights?.altitude?.polylines)} getCoordinateFraction={(index, polyline, polylines) => {
                        const closestCoordinateIndex = getClosestCoordinate(polylines[polyline][index], insights[dataMap].polylines[polyline].points.map((point) => point.coordinate));

                        function getFraction(value: number) {
                            let maximum = insights[dataMap].stats.maximum;
                            let relativeValue = value;

                            if(insights[dataMap].stats.minimum < 0) {
                                maximum += Math.abs(insights[dataMap].stats.minimum);
                                relativeValue += Math.abs(insights[dataMap].stats.minimum);
                            }

                            return relativeValue / maximum;
                        };

                        return getFraction(insights[dataMap].polylines[polyline].points[closestCoordinateIndex][dataMap]);
                    }}>
                        {(insights) && (
                            <ActivityDataMapGradient getUnit={(index) => {
                                if(dataMap === "altitude")
                                    return `${Math.round(insights.altitude.stats.minimum + (((insights.altitude.stats.maximum - insights.altitude.stats.minimum) / 5) * index))} m`;
                                else if(dataMap === "speed")
                                    return `${Math.round(((insights.speed.stats.maximum / 5) * index) * 3.6)} km/h`;
                            }}/>
                        )}
                    </ActivityDataMap>
                </View>

                {(insights) && (
                    (dataMap === "altitude")?(
                        <View style={{
                            flexDirection: "row"
                        }}>
                            <View style={{
                                flex: 1,
                                alignItems: "center"
                            }}>
                                <ParagraphText style={{ fontSize: 20 }}>{Math.round(insights.altitude.stats.minimum)} m</ParagraphText>
                                <ParagraphText>Min. altitude</ParagraphText>
                            </View>
                            
                            <View style={{
                                flex: 1,
                                alignItems: "center"
                            }}>
                                <ParagraphText style={{ fontSize: 20 }}>{Math.round(insights.altitude.stats.average)} m</ParagraphText>
                                <ParagraphText>Avg. altitude</ParagraphText>
                            </View>
                            
                            <View style={{
                                flex: 1,
                                alignItems: "center"
                            }}>
                                <ParagraphText style={{ fontSize: 20 }}>{Math.round(insights.altitude.stats.maximum)} m</ParagraphText>
                                <ParagraphText>Max. altitude</ParagraphText>
                            </View>
                        </View>
                    ):(
                        <View style={{
                            flexDirection: "row"
                        }}>
                            <View style={{
                                flex: 1,
                                alignItems: "center"
                            }}>
                                <ParagraphText style={{ fontSize: 20 }}>{Math.round(insights.speed.stats.minimum * 3.6)} km/h</ParagraphText>
                                <ParagraphText>Min. speed</ParagraphText>
                            </View>
                            
                            <View style={{
                                flex: 1,
                                alignItems: "center"
                            }}>
                                <ParagraphText style={{ fontSize: 20 }}>{Math.round(insights.speed.stats.average * 3.6)} km/h</ParagraphText>
                                <ParagraphText>Avg. speed</ParagraphText>
                            </View>
                            
                            <View style={{
                                flex: 1,
                                alignItems: "center"
                            }}>
                                <ParagraphText style={{ fontSize: 20 }}>{Math.round(insights.speed.stats.maximum * 3.6)} km/h</ParagraphText>
                                <ParagraphText>Max. speed</ParagraphText>
                            </View>
                        </View>
                    )
                )}
            </View>

            <View style={{ height: 200 }}>
                <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: theme.color, fontSize: 24 }}>Speed with elevation</ParagraphText>
                
                {(insights) && (
                    <Graph units={{ x: (value: number) => `${Math.round(value / 1000)} km`, y: "%" }} datasets={
                        insights.altitude.polylines.map((polyline) => {
                            return {
                                stroke: "green",
                                strokeOpacity: .5,

                                fill: css("green").darker(1).toString(),
                                fillOpacity: .85,

                                data: polyline.points.map((point) => {
                                    function getFraction(value: number) {
                                        let maximum = insights.altitude.stats.maximum;
                                        let relativeValue = value;

                                        if(insights.altitude.stats.minimum < 0) {
                                            maximum += Math.abs(insights.altitude.stats.minimum);
                                            relativeValue += Math.abs(insights.altitude.stats.minimum);
                                        }

                                        return relativeValue / maximum;
                                    };

                                    return {
                                        x: polyline.distanceOffset + point.distance,
                                        y: getFraction(point.altitude) * 100
                                    };
                                })
                            };
                        }).concat(
                            insights.speed.polylines.map((polyline) => {
                                return {
                                    stroke: "orange",
                                    strokeOpacity: .5,

                                    fill: css("orange").darker(1).toString(),
                                    fillOpacity: .85,

                                    data: polyline.points.map((point) => {
                                        return {
                                            x: polyline.distanceOffset + point.distance,
                                            y: (point.speed / (insights.speed.stats.maximum - insights.speed.stats.minimum)) * 100
                                        };
                                    })
                                };
                            })
                        )
                    } onDatasetPoints={() => {}}>
                        <ActivityDataMapSolids units={[
                            {
                                unit: "Altitude",
                                color: "green"
                            },

                            {
                                unit: "Speed",
                                color: "orange"
                            }
                        ]}/>
                    </Graph>
                )}
            </View>

            <View style={{ height: 200, gap: 10 }}>
                <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: theme.color, fontSize: 24 }}>Battery levels</ParagraphText>

                {(insights) && (
                    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => setSelectedBatteryPoint(null)}>
                        <View style={{ flex: 1 }}>
                            <Graph units={{ x: (value) => getFormattedDuration(value / 1000, true), y: "%" }} datasets={
                                insights.battery.polylines.map((polyline) => {
                                    return {
                                        data: polyline.points.map((point, index) => {
                                            return {
                                                x: point.timestamp ?? [ 0, 90 * 60 * 1000, 100 * 60 * 1000, 110 * 60 * 1000, 120 * 60 * 1000 ][index],
                                                y: point.batteryLevel
                                            };
                                        }).sort((a, b) => a.x - b.x)
                                    };
                                })
                            } onDatasetPoints={(datasets) => setBatteryDatasetPoints(datasets)}>
                                {batteryDatasetPoints.flatMap((dataset, index) => {
                                    return dataset.points.map((point, pointIndex) => {
                                        return (
                                            <React.Fragment key={`${index}_${pointIndex}`}>
                                                <GraphPoint point={point} selected={selectedBatteryPoint === point} onPress={() => setSelectedBatteryPoint(point)}/>

                                                {(selectedBatteryPoint === point) && (
                                                    <View style={{
                                                        position: "absolute",

                                                        left: point.location.x - 50,
                                                        top: point.location.y - 50,

                                                        width: 100,

                                                        justifyContent: "flex-end",
                                                        alignItems: "center"
                                                    }} pointerEvents="none">
                                                        <View style={{
                                                            backgroundColor: theme.background,
                                                            
                                                            paddingHorizontal: 5,
                                                            paddingVertical: 2,

                                                            borderRadius: 6
                                                        }}>
                                                            <CaptionText>{point.y}%</CaptionText>
                                                        </View>
                                                    </View>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                })}
                            </Graph>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        </React.Fragment>
    );
};
