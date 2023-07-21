import MapView, { Point } from "react-native-maps";
import { View, Dimensions, Text } from "react-native";
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

export type ActivityDataMapProps = {
    activity: {
        polylines?: string[];
    };
};

export default function ActivityDataMap({ activity }: ActivityDataMapProps) {
    const theme = useTheme();
    const mapStyle = useMapStyle();
    const userData = useUser();

    const mapViewRef = useRef<MapView>();
    
    const [ polylines, setPolylines ] = useState<ActivityDataMapPolylineProps["polylines"]>([]);

    useEffect(() => {
        handleRegionChangeComplete();
    }, [ activity ]);

    const handleRegionChangeComplete = useCallback(() => {
        if(!activity?.polylines)
            return;

        requestAnimationFrame(async () => {
            const dimensions = Dimensions.get("screen");

            const polylines = await Promise.all<ActivityDataMapPolylineProps["polylines"][0]>(activity.polylines.map(async (polyline) => {
                const coordinates = decode(polyline, 5).map((coordinate) => {
                    return {
                        latitude: coordinate[0],
                        longitude: coordinate[1]
                    };
                });

                return {
                    coordinates,
                    points: getStrippedPolylineByPoints(await Promise.all(coordinates.map(async (coordinate) => await mapViewRef.current.pointForCoordinate(coordinate))), dimensions.scale / 2 * 1)
                };
            }));

            const coordinates = polylines.flatMap((polyline) => polyline.coordinates);

            const startCoordinate = polylines[0].coordinates[0];
            const furthestCoordinate = getFurthestCoordinate(polylines.flatMap((polyline) => polyline.coordinates));

            mapViewRef.current.fitToCoordinates(coordinates, {
                animated: false,
                edgePadding: {
                    left: 20,
                    top: 20,
                    right: 20,
                    bottom: 20
                }
            });

            mapViewRef.current.setCamera({
                ...mapViewRef.current.getCamera(),
                heading: getRhumbLineBearing(startCoordinate, furthestCoordinate) + 90 + 180
            });

            setPolylines(polylines);
        });
    }, [ activity, mapViewRef ]);

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
                    onRegionChangeComplete={handleRegionChangeComplete}
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

                <ActivityDataMapPolyline polylines={polylines}/>

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
                    <View style={{
                        maxWidth: "70%",
                        flexDirection: "row",
                        opacity: .5
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
                                    {((index * 13))} km/h
                                </Text>

                                <View style={{
                                    backgroundColor: scale([ "green", "orange", "red" ])(index / (array.length - 1)).toString(),
                                    height: 10
                                }}/>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};
