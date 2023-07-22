import React, { useEffect, useState } from "react";
import { View } from "react-native";
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

export type ActivityInsightsProps = {
    activity: {
        id: string;
    };
};

export default function ActivityInsights({ activity }: ActivityInsightsProps) {
    const routesClient = useRoutesClient();
    const userData = useUser();
    const theme = useTheme();

    const [ insights, setInsights ] = useState<GetActivitySessionsInsightsResponse>(null);
    const [ batteryDatasetPoints, setBatteryDatasetPoints ] = useState<GraphDatasetPoints[]>([]);
    const [ selectedBatteryPoint, setSelectedBatteryPoint ] = useState<GraphDatasetPoints["points"][0]>(null);

    useEffect(() => {
        if(activity) {
            getActivitySessionsInsights(routesClient, activity.id).then((result) => {
                if(result.success) {
                    setInsights(result);
                } 
            });
        }
    }, [ activity ]);

    return (
        <React.Fragment>
            <View style={{ height: 200 }}>
                <ActivityDataMap activity={activity} type="Elevation" sessions={insights?.altitude?.polylines} getCoordinateFraction={(index, polyline, polylines) => {
                    const closestCoordinateIndex = getClosestCoordinate(polylines[polyline][index], insights.altitude.polylines[polyline].points.map((point) => point.coordinate));

                    return insights.altitude.polylines[polyline].points[closestCoordinateIndex].altitude / (insights.altitude.stats.maximum - insights.altitude.stats.minimum);
                }} getUnit={(index) => {
                    return `${Math.round(insights.altitude.stats.minimum + (((insights.altitude.stats.maximum - insights.altitude.stats.minimum) / 5) * index))} m`;
                }}/>
            </View>

            {(insights) && (
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
            )}

            <ParagraphText>{"<"}insert some fun elevation data here{">"}</ParagraphText>
            
            <View style={{ height: 200 }}>
                <ActivityDataMap activity={activity} type="Speed" sessions={insights?.speed?.polylines} getCoordinateFraction={(index, polyline, polylines) => {
                    const closestCoordinateIndex = getClosestCoordinate(polylines[polyline][index], insights.speed.polylines[polyline].points.map((point) => point.coordinate));

                    return insights.speed.polylines[polyline].points[closestCoordinateIndex].speed / insights.speed.stats.maximum;
                }} getUnit={(index) => {
                    return `${Math.round(((insights.speed.stats.maximum / 5) * index) * 3.6)} km/h`;
                }}/>
            </View>

            {(insights) && (
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
            )}

            <ParagraphText>{"<"}insert some fun speed data here{">"}</ParagraphText>

            <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: theme.color, fontSize: 24 }}>Battery</ParagraphText>

            <View style={{ height: 200 }}>
                {(insights) && (
                    <Graph units={{ x: (value) => getFormattedDuration(value / 1000, true), y: "%" }} datasets={
                        insights.battery.polylines.map((polyline) => {
                            console.log(JSON.stringify(polyline, undefined, 4))

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
                                    <GraphPoint key={`${index}_${pointIndex}`} point={point} selected={selectedBatteryPoint === point} onPress={() => setSelectedBatteryPoint(point)}/>
                                );
                            })
                        })}
                    </Graph>
                )}
            </View>
        </React.Fragment>
    );
};
