import { useEffect, useState, useRef } from "react";
import { Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { useThemeConfig, useMapStyle } from "../../utils/themes";
import { decode } from "@googlemaps/polyline-codec";

type ActivityMapProps = {
    activity: any | null;
    children?: any;
    compact: boolean;
};

export default function ActivityMap({ activity, children, compact }: ActivityMapProps) {
    const mapStyle = useMapStyle();
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const [ points, setPoints ] = useState(null);

    const mapViewRef = useRef();

    useEffect(() => {
        if(activity?.polyline) {
            setPoints(decode(activity.polyline, 5));
        }
    }, [ activity ]);

    useEffect(() => {
        if(mapViewRef && points) {
            const mapView = mapViewRef.current as MapView;

            mapView.fitToCoordinates(points.map((point) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                };
            }), {
                edgePadding: {
                    left: 20,
                    top: 20,
                    right: 20,
                    bottom: 60
                },
                animated: false
            });
        }
    }, [ points ])

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
            <MapView
                ref={mapViewRef}
                style={{
                    width: "100%",
                    height: "100%",
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
                pointerEvents={(compact)?("none"):("auto")}
                provider={PROVIDER_GOOGLE}
                customMapStyle={(compact)?(themeConfig.mapStyle.concat(mapStyle.compact as any[])):(themeConfig.mapStyle)}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}>
                {(points) && (
                    <Polyline coordinates={points.map((point) => {
                        return {
                            latitude: point[0],
                            longitude: point[1]
                        };
                    })} strokeColor={themeConfig.brand} strokeWidth={4}/>
                )}
            </MapView>

            {children}
        </View>
    );
};
