import React, { useEffect, useState, useRef } from "react";
import { Image, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { useThemeConfig, useMapStyle } from "../../utils/themes";
import { decode } from "@googlemaps/polyline-codec";
import { CaptionText } from "../../components/texts/caption";
import { ParagraphText } from "../../components/texts/paragraph";
import { getDistance, getCompassDirection } from "geolib";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentType } from "../../models/componentType";

type ActivityMapProps = {
    activity: any | null;
    children?: any;
    type: ComponentType;
};

function getStylingForHeading(position: any, heading: any, layout: any): any[] {
    let horizontal = {}, vertical = {};

    if(heading[0] === 'S' || heading[1] === 'S') { // polyline goes south, anchor by bottom
        vertical = {
            bottom: 0
        };
    }
    else if(heading[0] === 'N' || heading[1] === 'N') { // polyline goes north, anchor by top
        vertical = {
            top: 0
        };
    }

    if(position.x > (layout?.width / 3 * 2)) { // it's most likely to touch the right side, anchor by right
        horizontal = {
            right: 0,
            alignItems: "flex-end"
        }
    }
    else if(position.x > (layout?.width / 3 * 1) && position.x < (layout?.width / 2)) { // it's most likely to touch the right side, anchor by right
        horizontal = {
            right: 0,
            alignItems: "flex-end"
        }
    }
    
    if(position.y > (layout?.height / 2)) { // it's most likely to touch the right side, anchor by right
        vertical = {
            bottom: 0
        }
    }

    return [ horizontal, vertical ];
};

export default function ActivityMap({ activity, children, type }: ActivityMapProps) {
    const mapStyle = useMapStyle();
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const [ layout, setLayout ] = useState(null);
    const [ polylines, setPolylines ] = useState(null);

    const [ startPosition, setStartPosition ] = useState(null);
    const [ startPositionHeading, setStartPositionHeading ] = useState(null);

    const [ finishPosition, setFinishPosition ] = useState(null);
    const [ finishPositionHeading, setFinishPositionHeading ] = useState(null);

    const mapViewRef = useRef();

    useEffect(() => {
        if(activity?.polylines) {
            setPolylines(activity.polylines.map((polyline) => decode(polyline, 5)));
        }
    }, [ activity ]);

    useEffect(() => {
        if(mapViewRef && polylines) {
            const mapView = mapViewRef.current as MapView;

            const points = [];

            polylines.forEach((polyline) => {
                polyline.forEach((point) => {
                    points.push({
                        latitude: point[0],
                        longitude: point[1]
                    });
                });
            });

            if(type === ComponentType.Default) {
                mapView.fitToCoordinates(points, {
                    edgePadding: {
                        left: 20,
                        top: 40,
                        right: 20,
                        bottom: 40
                    },
                    animated: false
                });
            }
            else if(type === ComponentType.Compact) {
                mapView.fitToCoordinates(points, {
                    edgePadding: {
                        left: 20,
                        top: 40,
                        right: 20,
                        bottom: 60
                    },
                    animated: false
                });
            }
            else {
                mapView.fitToCoordinates(points, {
                    edgePadding: {
                        left: 10,
                        top: 10,
                        right: 10,
                        bottom: 25
                    },
                    animated: false
                });
            }
        }
    }, [ polylines ]);

    useEffect(() => {
        if(polylines && startPosition) {
            let distance = 0;

            let previousPoint = null;

            for(let polyline of polylines) {
                for(let point of polyline) {
                    if(previousPoint === null) {
                        previousPoint = point;

                        continue;
                    }

                    distance += getDistance(previousPoint, point, 1);

                    previousPoint = point;

                    if(distance > 5000)
                        break;
                }

                if(distance > 5000)
                    break;
            }

            const heading = getCompassDirection(polylines[0][0], previousPoint);

            setStartPositionHeading(heading);
        }
    }, [ startPosition ]);

    useEffect(() => {
        if(polylines && finishPosition) {
            let distance = 0;

            let previousPoint = null;

            const reversedPolylines = [];
            
            for(let index = polylines.length - 1; index != -1; index--) {
                const points = [];

                for(let point = polylines[index].length - 1; point != -1; point--)
                    points.push(polylines[index][point]);

                reversedPolylines.push(points);
            }

            for(let polyline of reversedPolylines) {
                for(let point of polyline) {
                    if(previousPoint === null) {
                        previousPoint = point;

                        continue;
                    }

                    distance += getDistance(previousPoint, point, 1);

                    previousPoint = point;

                    if(distance > 5000)
                        break;
                }

                if(distance > 5000)
                    break;
            }

            const heading = getCompassDirection(previousPoint, reversedPolylines[0][0]);

            setFinishPositionHeading(heading);
        }
    }, [ finishPosition ]);

    if(!activity) {
        return (
            <View style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,

                backgroundColor: themeConfig.placeholder
            }}/>
        );
    }

    return (
        <View style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
            <View style={{
                position: "relative",
                
                width: "100%",
                height: "100%"
            }}>
                <MapView
                    ref={mapViewRef}
                    style={{
                        flex: 1,
                        
                        backgroundColor: "black"
                    }}
                    initialCamera={{
                        center: {
                            latitude: 58.3797265530217,
                            longitude: 12.324476378487843
                        },

                        heading: 0,
                        pitch: 0,

                        zoom: 10
                    }}
                    onRegionChangeComplete={() => {
                        if(!polylines)
                            return;

                        const mapView = mapViewRef.current as MapView;

                        mapView.pointForCoordinate({
                            latitude: polylines[0][0][0],
                            longitude: polylines[0][0][1]
                        }).then((position) => {
                            setStartPosition(position);
                        });

                        const lastPoint = polylines[polylines.length - 1][polylines[polylines.length - 1].length - 1];

                        mapView.pointForCoordinate({
                            latitude: lastPoint[0],
                            longitude: lastPoint[1]
                        }).then((position) => {
                            setFinishPosition(position);
                        });
                    }}
                    onLayout={(event) => setLayout(event.nativeEvent.layout)}
                    pointerEvents={(type !== ComponentType.Default)?("none"):("auto")}
                    provider={PROVIDER_GOOGLE}
                    customMapStyle={(type !== ComponentType.Default)?(themeConfig.mapStyle.concat(mapStyle.compact as any[])):(themeConfig.mapStyle)}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    scrollEnabled={false}>
                    {(polylines) && polylines.map((polyline, index) => (
                        <Polyline key={index} coordinates={polyline.map((point) => {
                            return {
                                latitude: point[0],
                                longitude: point[1]
                            };
                        })} strokeColor={themeConfig.brand} strokeWidth={4}/>
                    ))}
                </MapView>

                {(startPosition && startPositionHeading) && (
                    <View style={{
                        position: "absolute",
                        top: startPosition.y,
                        left: startPosition.x
                    }}>
                        <View style={[
                            {
                                position: "absolute"
                            },
                            ...getStylingForHeading(startPosition, startPositionHeading, layout)
                        ]}>
                            {(type !== ComponentType.ListItem) && (<ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: "#FFF", textShadowColor: "#000", textShadowRadius: 2 }}>Start</ParagraphText>)}
                            
                            <CaptionText style={{ textTransform: "uppercase", fontStyle: "italic", color: "#FFF", textShadowColor: "#000", textShadowRadius: 2, fontWeight: "600", fontSize: (type === ComponentType.ListItem)?(12):(17) }}>{activity.summary?.startArea}</CaptionText>
                        </View>
                    </View>
                )}

                {(finishPosition && finishPositionHeading) && (
                    <View style={{
                        position: "absolute",
                        top: finishPosition.y,
                        left: finishPosition.x
                    }}>
                        <View style={[
                            {
                                position: "absolute"
                            },
                            ...getStylingForHeading(finishPosition, finishPositionHeading, layout)
                        ]}>
                            {(type !== ComponentType.ListItem) && (<ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: "#FFF", textShadowColor: "#000", textShadowRadius: 2 }}>Finish</ParagraphText>)}

                            <CaptionText style={{ textTransform: "uppercase", fontStyle: "italic", color: "#FFF", textShadowColor: "#000", textShadowRadius: 2, fontWeight: "600", fontSize: (type === ComponentType.ListItem)?(12):(17) }}>{activity.summary?.finishArea}</CaptionText>
                        </View>
                    </View>
                )}
            </View>

            {children}
        </View>
    );
};
