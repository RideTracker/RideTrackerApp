import React, { useRef, useState } from "react";
import { decode } from "@googlemaps/polyline-codec";
import { GetRoutesByFeedResponse, GetRoutesByUserFeedResponse } from "@ridetracker/ridetrackerclient";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, Image } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { useClient } from "../modules/useClient";
import { useMapStyle, useTheme } from "../utils/themes";
import { useUser } from "../modules/user/useUser";
import { ParagraphText } from "./texts/Paragraph";
import { BikeActivitySummary } from "./BikeActivitySummary";
import { CaptionText } from "./texts/Caption";
import getFormattedDuration from "../controllers/getFormattedDuration";
import getDurationAsNumber from "../controllers/getDurationAsNumber";
import { RouteListRouteData } from "./RoutesList";
import getJsonColor from "../controllers/getJsonColor";
import Constants from "expo-constants";

export type RoutesListItemProps = {
    route: RouteListRouteData;
    onPress: () => void;
};

export function RoutesListItem({ route, onPress }: RoutesListItemProps) {
    const router = useRouter();
    const theme = useTheme();
    const client = useClient();
    const userData = useUser();
    const mapStyle = useMapStyle();

    const mapViewRef = useRef<MapView>();

    return (
        <View style={{
            flexDirection: "row",
            gap: 10,
            height: 80,

            alignItems: "center"
        }}>
            <TouchableOpacity style={{ width: 140, borderRadius: 10, overflow: "hidden", backgroundColor: theme.placeholder }} onPress={() => onPress()}>
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
                    onMapReady={() => mapViewRef.current.fitToCoordinates(route.decodedPolyline, { animated: false })}
                    >
                    <Polyline coordinates={route.decodedPolyline} fillColor={getJsonColor(route.color, theme)} strokeColor={getJsonColor(route.color, theme)} strokeWidth={4}/>
                </MapView>
            </TouchableOpacity>

            <View style={{
                flex: 1,
                paddingVertical: 2,
                justifyContent: "space-around",
                gap: 10
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

                {(route?.user) && (
                    <View style={{
                        flexDirection: "row",
                        gap: 10,

                        alignItems: "center"
                    }}>
                        <TouchableOpacity style={{
                            flexDirection: "row",
                            gap: 10,

                            alignItems: "center"
                        }} onPress={() => router.push(`/profile/${route.user}`)}>
                            <View style={{
                                height: 25,
                                aspectRatio: 1,
                                
                                backgroundColor: theme.placeholder,
                                
                                borderRadius: 25,
                                overflow: "hidden"
                            }}>
                                <Image
                                    source={{
                                        uri: `${Constants.expoConfig.extra.images}/${route.user.avatar}/Avatar`
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}/>
                            </View>

                            <CaptionText>{route.user.name}</CaptionText>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};
