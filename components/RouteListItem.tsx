import React, { useRef, useState } from "react";
import { decode } from "@googlemaps/polyline-codec";
import { GetRoutesByUserFeedResponse } from "@ridetracker/ridetrackerclient";
import { useRouter } from "expo-router";
import { View } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { useClient } from "../modules/useClient";
import { useMapStyle, useTheme } from "../utils/themes";
import { useUser } from "../modules/user/useUser";
import { ParagraphText } from "./texts/Paragraph";
import { BikeActivitySummary } from "./BikeActivitySummary";
import { CaptionText } from "./texts/Caption";
import getFormattedDuration from "../controllers/getFormattedDuration";
import getDurationAsNumber from "../controllers/getDurationAsNumber";

export type RoutesListItemProps = {
    route: GetRoutesByUserFeedResponse["routes"][0];
};

export function RoutesListItem({ route }: RoutesListItemProps) {
    const router = useRouter();
    const theme = useTheme();
    const client = useClient();
    const userData = useUser();
    const mapStyle = useMapStyle();

    const mapViewRef = useRef<MapView>();

    const [ coordinates ] = useState<{
        latitude: number;
        longitude: number;
    }[]>(decode(route.polyline).map((item) => { 
        return {
            latitude: item[0],
            longitude: item[1]
        };
    }));

    return (
        <View style={{
            flexDirection: "row",
            gap: 10,
            height: 80,

            alignItems: "center"
        }}>
            <View style={{ width: 140, borderRadius: 10, overflow: "hidden", backgroundColor: theme.placeholder }}>
                <MapView
                    style={{ flex: 1 }}
                    ref={mapViewRef}
                    pointerEvents={"none"}
                    provider={userData.mapProvider}
                    customMapStyle={theme.mapStyle.concat(mapStyle.compact)}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    scrollEnabled={false}
                    onMapReady={() => mapViewRef.current.fitToCoordinates(coordinates, { animated: false })}
                    >
                    <Polyline coordinates={coordinates} fillColor={theme.brand} strokeColor={theme.brand} strokeWidth={2}/>
                </MapView>
            </View>

            <View style={{
                flex: 1,
                paddingVertical: 2,
                justifyContent: "space-around",
                gap: 5
            }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <View>
                        <CaptionText style={{ textAlign: "center", fontSize: 16 }}>{Math.round(route.distance / 1000) + " km"}</CaptionText>
                        <ParagraphText style={{ textAlign: "center", fontSize: 12 }}>distance</ParagraphText>
                    </View>
                    
                    <View>
                        <CaptionText style={{ textAlign: "center", fontSize: 16 }}>{getFormattedDuration(getDurationAsNumber(route.duration), true)}</CaptionText>
                        <ParagraphText style={{ textAlign: "center", fontSize: 12 }}>duration</ParagraphText>
                    </View>
                    
                    <View>
                        <CaptionText style={{ textAlign: "center", fontSize: 16 }}>{route.waypoints.length}</CaptionText>
                        <ParagraphText style={{ textAlign: "center", fontSize: 12 }}>waypoint{(route.waypoints.length === 1)?(''):('s')}</ParagraphText>
                    </View>
                </View>
            </View>
        </View>
    );
};
