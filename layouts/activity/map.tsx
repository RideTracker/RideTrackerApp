import React, { useEffect, useState, useRef } from "react";
import { Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { useThemeConfig, useMapStyle } from "../../utils/themes";
import { decode } from "@googlemaps/polyline-codec";
import { CaptionText } from "../../components/texts/caption";
import { ParagraphText } from "../../components/texts/paragraph";

type ActivityMapProps = {
    activity: any | null;
    children?: any;
    compact: boolean;
};

export default function ActivityMap({ activity, children, compact }: ActivityMapProps) {
    const mapStyle = useMapStyle();
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const [ polylines, setPolylines ] = useState(null);
    const [ layout, setLayout ] = useState(null);
    const [ startPosition, setStartPosition ] = useState(null);
    const [ finishPosition, setFinishPosition ] = useState(null);

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

            mapView.fitToCoordinates(points, {
                edgePadding: {
                    left: 20,
                    top: 20,
                    right: 20,
                    bottom: 60
                },
                animated: false
            });
        }
    }, [ polylines ])

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
                    pointerEvents={(compact)?("none"):("auto")}
                    provider={PROVIDER_GOOGLE}
                    customMapStyle={(compact)?(themeConfig.mapStyle.concat(mapStyle.compact as any[])):(themeConfig.mapStyle)}
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

                {(startPosition) && (
                    <View style={{
                        position: "absolute",
                        top: startPosition.y,
                        left: startPosition.x
                    }}>
                        <View style={[
                            {
                                position: "absolute"
                            },
                            (startPosition.x > (layout?.width / 2)) && {
                                right: 0,
                                alignItems: "flex-end"
                            },
                            (startPosition.y > (layout?.height / 2)) && {
                                bottom: 0
                            }
                        ]}>
                            <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", textShadowRadius: 2 }}>Start</ParagraphText>
                            <CaptionText style={{ textTransform: "uppercase", fontStyle: "italic", textShadowColor: "#000", textShadowRadius: 2, fontWeight: "500" }}>{activity.summary?.startArea}</CaptionText>
                        </View>
                    </View>
                )}

                {(finishPosition) && (
                    <View style={{
                        position: "absolute",
                        top: finishPosition.y,
                        left: finishPosition.x
                    }}>
                        <View style={[
                            {
                                position: "absolute"
                            },
                            (finishPosition.x > (layout?.width / 2)) && {
                                right: 0,
                                alignItems: "flex-end"
                            },
                            (finishPosition.y > (layout?.height / 2)) && {
                                bottom: 0
                            }
                        ]}>
                            <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", textShadowRadius: 2 }}>Finish</ParagraphText>
                            <CaptionText style={{ textTransform: "uppercase", fontStyle: "italic", textShadowColor: "#000", textShadowRadius: 2, fontWeight: "500" }}>{activity.summary?.finishArea}</CaptionText>
                        </View>
                    </View>
                )}
            </View>

            {children}
        </View>
    );
};
