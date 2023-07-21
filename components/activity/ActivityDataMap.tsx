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
import CategorySelector from "../CategorySelector";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type ActivityDataMapProps = {
    activity: {
        id: string;
        polylines?: string[];
    };

    type: string;

    getSessions: () => Promise<{
        polylines: {
            points: {
                coordinate: {
                    latitude: number;
                    longitude: number;
                };
            }[];
        }[];
    }>;

    getCoordinateFraction: (index: number, sessions: any, polyline: number, polylines: Coordinate[][]) => number;
    getUnit: (index: number, sessions: any) => string;
};

export default function ActivityDataMap({ activity, type, getSessions, getCoordinateFraction, getUnit }: ActivityDataMapProps) {
    const theme = useTheme();
    const mapStyle = useMapStyle();
    const userData = useUser();

    const mapViewRef = useRef<MapView>();
    
    const [ sessions, setSessions ] = useState<{
        polylines: {
            points: {
                coordinate: {
                    latitude: number;
                    longitude: number;
                };
            }[];
        }[];
    }>(null);
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

            getSessions().then((result) => {
                setSessions(result);
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

                        opacity: .75
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
                    <ActivityDataMapPolyline key={JSON.stringify(polylines)} mapViewRef={mapViewRef} region={region} polylines={polylines} getCoordinateFraction={(index, polyline) => getCoordinateFraction(index, sessions, polyline, polylines)}/>
                )}

                {/*<View style={{
                    position: "absolute",

                    top: 0,
                    left: 0,
                    
                    width: "100%"
                }}>
                    <CategorySelector items={[
                        {
                            name: "Elevation",
                            type: "elevation",
                            icon: (<MaterialCommunityIcons name="elevation-rise" size={24} color={theme.color}/>)
                        },
                        
                        {
                            name: "Speed",
                            type: "speed",
                            icon: (<MaterialCommunityIcons name="bike-fast" size={24} color={theme.color}/>)
                        },
                        
                        {
                            name: "Speed",
                            type: "speed",
                            icon: (<MaterialCommunityIcons name="bike-fast" size={24} color={theme.color}/>)
                        }
                    ]} selectedItem={null} onItemPress={() => {}}/>
                </View>*/}

                <View style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    padding: 10
                }}>
                    <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: theme.color, textShadowColor: (theme.contrast === "dark")?("transparent"):("#000"), textShadowRadius: 2, fontSize: 24 }}>{type}</ParagraphText>
                </View>

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
                                        {getUnit(index, sessions)}
                                    </Text>

                                    <View style={{
                                        backgroundColor: scale([ "green", "orange", "red" ])(index / (array.length - 1)).toString(),
                                        height: 8
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
