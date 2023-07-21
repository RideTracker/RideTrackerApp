import MapView, { Point, Region } from "react-native-maps";
import { View, Dimensions, Text, Platform } from "react-native";
import { useMapStyle, useTheme } from "../../utils/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { decode } from "@googlemaps/polyline-codec";
import { useUser } from "../../modules/user/useUser";
import ActivityDataMapPolyline, { ActivityDataMapPolylineProps } from "./ActivityDataMapPolyline";
import getStrippedPolylineByPoints from "../../controllers/polylines/getStrippedPolylineByPoints";
import { CaptionText } from "../texts/Caption";
import { ParagraphText } from "../texts/Paragraph";
import { LinearGradient } from "expo-linear-gradient";
import getFurthestCoordinate from "../../controllers/polylines/getFurthestCoordinate";
import { getBounds, getRhumbLineBearing } from "geolib";
import { SmallText } from "../texts/Small";
import { scale } from "chroma.ts";
import { useRoutesClient } from "../../modules/useRoutesClient";
import { getActivitySessionsAltitude, GetActivitySessionsAltitudeResponse } from "@ridetracker/routeclient";
import getClosestCoordinate from "../../controllers/polylines/getClosestCoordinate";
import { Coordinate } from "../../models/Coordinate";

export type ActivityDataMapProps = {
    activity: {
        id: string;
        polylines?: string[];
    };
};

export default function ActivityDataMap({ activity }: ActivityDataMapProps) {
    const theme = useTheme();
    const mapStyle = useMapStyle();
    const userData = useUser();
    const routesClient = useRoutesClient();

    const mapViewRef = useRef<MapView>();
    
    const [ sessions, setSessions ] = useState<GetActivitySessionsAltitudeResponse>(null);
    const [ polylines, setPolylines ] = useState<Coordinate[][]>(null);
    const [ region, setRegion ] = useState<Region>(null);

    useEffect(() => {
        if(activity) {
            setPolylines(activity.polylines.map((polyline) => decode(polyline).map((coordinate) => {
                return {
                    latitude: coordinate[0],
                    longitude: coordinate[1]
                };
            })));

            getActivitySessionsAltitude(routesClient, activity.id).then((result) => {
                console.log("result");
                console.log(result);

                if(result.success) {
                    setSessions(result);
                }
            });
        }
    }, [ activity ]);

    /*const handleRegionChangeComplete = useCallback(() => {
        if(!activity?.polylines || !sessions)
            return;

        handleRender(sessions);
    }, [ activity, sessions, mapViewRef ]);*/

    return (
        <View style={{
            flex: 1,
            flexDirection: "row",
            gap: 10
        }}>
            <View style={{
                flex: 1,
                overflow: "hidden",
                borderRadius: 10,

                position: "relative"
            }}>
                <MapView
                    ref={mapViewRef}
                    customMapStyle={theme.mapStyle.concat(mapStyle.compact)}
                    onRegionChangeComplete={(region) => setRegion(region)}
                    showsCompass={false}
                    style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%",

                        opacity: .4
                    }}
                    provider={userData.mapProvider}
                >
                </MapView>

                {(Platform.OS === "android") && (
                    <LinearGradient colors={[ theme.background, "transparent", theme.background ]} locations={[ 0, 0.1, 0.9 ]} style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%"
                    }}>
                        <LinearGradient colors={[ theme.background, "transparent", theme.background ]} locations={[ 0, 0.1, 0.9 ]} style={{
                            position: "absolute",

                            left: 0,
                            top: 0,

                            width: "100%",
                            height: "100%"
                        }} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1}}/>
                    </LinearGradient>
                )}

                {(sessions) && (
                    <ActivityDataMapPolyline mapViewRef={mapViewRef} region={region} polylines={polylines} getCoordinateFraction={(index, polyline) => {
                        const closestCoordinateIndex = getClosestCoordinate(polylines[polyline][index], sessions.polylines[polyline].points.map((point) => point.coordinate));

                        return sessions.polylines[polyline].points[closestCoordinateIndex].altitude / (sessions.altitudes.maximum - sessions.altitudes.minimum);
                    }}/>
                )}

                <View style={{
                    position: "absolute",

                    bottom: 0,
                    right: 0,
                    
                    padding: 10,

                    width: "100%",

                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    gap: 5,

                    flexDirection: "row"
                }}>
                    {(sessions) && (
                        <View style={{
                            maxWidth: "70%",
                            flexDirection: "row"
                        }}>
                            {Array(5).fill(null).map((_, index, array) => (
                                <View key={index} style={{
                                    gap: 5,
                                    flex: 1
                                }}>
                                    <Text style={{
                                        color: theme.color,
                                        fontSize: 10,
                                        paddingRight: 5
                                    }} numberOfLines={1}>
                                        {Math.round(sessions.altitudes.minimum + (((sessions.altitudes.maximum - sessions.altitudes.minimum) / 5) * index))} m
                                    </Text>

                                    <View style={{
                                        backgroundColor: scale([ "green", "orange", "red" ])(index / (array.length - 1)).toString(),
                                        height: 10
                                    }}/>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};
