import MapView, { Point, Region } from "react-native-maps";
import { View, Dimensions, Text, Platform, LayoutRectangle } from "react-native";
import { useMapStyle, useTheme } from "../../utils/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { decode } from "@googlemaps/polyline-codec";
import { useUser } from "../../modules/user/useUser";
import ActivityDataMapPolyline, { ActivityDataMapPolylineProps } from "./ActivityDataMapPolyline";
import { ParagraphText } from "../texts/Paragraph";
import { LinearGradient } from "expo-linear-gradient";
import { scale } from "chroma.ts";
import { Coordinate } from "../../models/Coordinate";
import getStrippedPolylineByCoordinates from "../../controllers/polylines/getStrippedPolylineByCoordinates";

export type ActivityDataMapProps = {
    activity: {
        id: string;
        polylines?: string[];
    };

    type: string;

    sessions: {
        points: {
            coordinate: {
                latitude: number;
                longitude: number;
            };
        }[];
    }[];

    getCoordinateFraction: (index: number, polyline: number, polylines: Coordinate[][]) => number;
    getUnit: (index: number) => string;
};

export default function ActivityDataMap({ activity, type, sessions, getCoordinateFraction, getUnit }: ActivityDataMapProps) {
    const theme = useTheme();
    const mapStyle = useMapStyle();
    const userData = useUser();

    const mapViewRef = useRef<MapView>();

    const [ polylines, setPolylines ] = useState<Coordinate[][]>(null);
    const [ region, setRegion ] = useState<Region>(null);
    const [ layout, setLayout ] = useState<LayoutRectangle>(null);

    useEffect(() => {
        if(activity) {
            requestAnimationFrame(() => {
                setPolylines(activity.polylines.map((polyline) => getStrippedPolylineByCoordinates(decode(polyline).map((coordinate) => {
                    return {
                        latitude: coordinate[0],
                        longitude: coordinate[1]
                    };
                }), 1000)));
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
            }} onLayout={(event) => setLayout(event.nativeEvent.layout)}>
                <View style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%",

                    borderRadius: 20,
                    overflow: "hidden"
                }}>
                    <MapView
                        ref={mapViewRef}
                        customMapStyle={theme.mapStyle.concat(mapStyle.compact)}
                        onRegionChangeComplete={(region) => setRegion(region)}
                        showsCompass={false}
                        style={{
                            flex: 1,

                            opacity: .75
                        }}
                        provider={userData.mapProvider}
                    >
                    </MapView>
                </View>

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
                    <ActivityDataMapPolyline key={JSON.stringify(polylines)} layout={layout} mapViewRef={mapViewRef} region={region} polylines={polylines} getCoordinateFraction={(index, polyline) => getCoordinateFraction(index, polyline, polylines)}/>
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
                    <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: theme.color, fontSize: 24 }}>{type}</ParagraphText>
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
                        }}>
                            {Array(5).fill(null).map((_, index, array) => (
                                <View key={index} style={{
                                    gap: 5,
                                    flex: 1
                                }}>
                                    <Text style={{
                                        color: "silver",
                                        fontSize: 10,
                                        paddingRight: 5
                                    }} numberOfLines={1}>
                                        {getUnit(index)}
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
