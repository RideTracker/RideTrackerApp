import React, { useState, useEffect, useRef } from "react";
import { LayoutRectangle, View } from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import { useMapStyle, useTheme } from "../../../../../utils/themes";
import MapView, { Polyline } from "react-native-maps";
import { HeaderText } from "../../../../../components/texts/Header";
import * as Location from "expo-location";
import { createRoute, getMapsRoutes } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../../modules/useClient";
import { useUser } from "../../../../../modules/user/useUser";
import { SearchPrediction } from "../../../../../models/SearchPrediction";
import { decode, encode } from "@googlemaps/polyline-codec";
import MapRouteMarkers from "../../../../../components/maps/MapRouteMarkers";
import OfflinePageOverlay from "../../../../../components/OfflinePageOverlay";
import useInternetConnection from "../../../../../modules/useInternetConnection";
import PermissionsPageOverlay from "../../../../../components/PermissionsPageOverlay";
import PageOverlay from "../../../../../components/PageOverlay";
import { DrawingPolyline } from "../../../../../components/DrawingOverlay";
import RouteEditor from "../../../../../components/RouteEditor";
import Tabs, { TabsPage } from "../../../../../components/Tabs";
import { ParagraphText } from "../../../../../components/texts/Paragraph";
import { RoutesList } from "../../../../../components/RoutesList";
import ResizableView from "../../../../../components/ResizableView";

global.coordinates = [];

export type RouteWaypoint = {
    type: "SEARCH_PREDICTION" | "PATH";
    searchPrediction?: SearchPrediction;
    path?: RoutePath;
};

export type RoutePath = {
    original: DrawingPolyline;
    route: DrawingPolyline;
    distance: number;
    duration: string;
};

export default function Routes() {
    const client = useClient();
    const theme = useTheme();
    const mapStyle = useMapStyle();
    const userData = useUser();
    const internetConnection = useInternetConnection();

    const mapRef = useRef<MapView>();

    const [ drawingPolyline, setDrawingPolyline ] = useState<DrawingPolyline>(null);

    const [ height, setHeight ] = useState<number>(null);
    const [ focus, setFocus ] = useState<boolean>(false);
    const [ initialLocation, setInitialLocation ] = useState(null);
    const [ searchLayout, setSearchLayout ] = useState<LayoutRectangle>(null);
    const [ mapLayout, setMapLayout ] = useState<LayoutRectangle>(null);
    const [ waypoints, setWaypoints ] = useState<RouteWaypoint[]>([]);
    const [ waypointsLayout, setWaypointsLayout ] = useState<LayoutRectangle>(null);
    const [ routes, setRoutes ] = useState<{
        polyline: { latitude: number; longitude: number; }[];
        distance: number;
        duration: string;
    }>(null);
    const [ permissions, setPermissions ] = useState<Location.LocationPermissionResponse>(null);

    useFocusEffect(() => {
        setFocus(true);

        return () => setFocus(false);
    });

    useEffect(() => {
        Location.getForegroundPermissionsAsync().then((permissions) => {
            setPermissions(permissions);
        });
    }, []);

    useEffect(() => {
        if(permissions?.granted) {
            Location.getCurrentPositionAsync().then((location) => {
                setInitialLocation(location);
    
                mapRef.current.setCamera({
                    zoom: 12,
                    
                    center: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }
                });
            });
        }
    }, [ permissions ]);

    useEffect(() => {
        if(waypoints.length >= 2) {
            getMapsRoutes(client, waypoints.flatMap((waypoint) => {
                if(waypoint.type === "SEARCH_PREDICTION")
                    return waypoint.searchPrediction.location;
                else if(waypoint.type === "PATH") {
                    return [
                        waypoint.path.original[0],
                        waypoint.path.original[waypoint.path.original.length - 1]
                    ];
                }
            })).then((result) => {
                const route = result.routes[0];

                let polyline = decode(route.polyline, 5).map((coordinate) => {
                    return {
                        latitude: coordinate[0],
                        longitude: coordinate[1]
                    };
                });

                waypoints.filter((waypoint) => waypoint.type === "PATH").forEach((waypoint) => {
                    const startCoordinate = waypoint.path.route[0];
                    const endCoordinate = waypoint.path.route[waypoint.path.route.length - 1];

                    const startIndex = polyline.findIndex((coordinate) => coordinate.latitude === startCoordinate.latitude && coordinate.longitude === startCoordinate.longitude);
                    const endIndex = polyline.findLastIndex((coordinate) => coordinate.latitude === endCoordinate.latitude && coordinate.longitude === endCoordinate.longitude);

                    if(startIndex !== -1 && endIndex !== -1) {
                        const startSection = polyline.slice(0, startIndex);
                        const endSection = polyline.slice(endIndex, polyline.length);

                        polyline = startSection.concat(waypoint.path.route, endSection);

                        if(polyline.length !== startSection.length + waypoint.path.route.length + endSection.length)
                            console.error("Something does not add up in the result polyline!");
                        else
                            console.log("Intercepted with custom route!");
                    }
                    else
                        console.error("Failed to extract path route from returned route!");
                });

                setRoutes({
                    polyline,
                    duration: route.duration,
                    distance: route.distance
                });
            })
        }
        else if(waypoints.length === 1 && waypoints[0].type === "PATH") {
            setRoutes({
                polyline: waypoints[0].path.route,
                duration: waypoints[0].path.duration,
                distance: waypoints[0].path.distance
            });
        }
        else
            setRoutes(null);
    }, [ waypoints.length ]);

    useEffect(() => {
        if(waypoints.length && waypointsLayout) {
            if(waypoints.length > 1 || waypoints[0].type === "PATH") {
                mapRef.current.fitToCoordinates(waypoints.flatMap((waypoint) => {
                    if(waypoint.type === "SEARCH_PREDICTION")
                        return waypoint.searchPrediction.location;
                    else if(waypoint.type === "PATH")
                        return waypoint.path.original;
                }), {
                    animated: true,
                    edgePadding: {
                        left: 40,
                        top: 10 + ((searchLayout)?(searchLayout.y + searchLayout.height):(0)),
                        right: 40,
                        bottom: 10 + 40 + ((waypointsLayout)?(waypointsLayout.height):(0))
                    }
                });
            }
            else {
                mapRef.current.setCamera({
                    center: waypoints[0].searchPrediction.location,
                    zoom: 12
                });
            }
        }
    }, [ waypointsLayout?.height, waypoints.length ]);


    /*useEffect(() => {
        if(drawing) {
            const timer = setInterval(() => {
                setDrawingTimestamp(Date.now());
            }, 30);

            return () => {
                clearInterval(timer);
            };
        }
    }, [ drawing ]);*/

    return (
        <View style={{ flex: 1, position: "relative", backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Routes",
                headerShown: false,
                headerTransparent: true,
                /*headerRight: () => (
                    <View style={{ marginRight: 20 }}>
                        <TouchableOpacity>
                            <FontAwesome name="plus" size={24} color={theme.color}/>
                        </TouchableOpacity>
                    </View>
                )*/
            }} />

            {(focus) && (
                <MapView
                    ref={mapRef}
                    onLayout={(event) => setMapLayout(event.nativeEvent.layout)}
                    provider={userData.mapProvider}
                    showsUserLocation={false}
                    style={{
                        position: "absolute",

                        width: "100%",
                        height: "100%",

                        left: 0,
                        bottom: 0
                    }}
                    /*onPanDrag={(event) => {
                        if(drawing) {
                            global.coordinates = global.coordinates.concat(event.nativeEvent.coordinate);
                        }
                    }}*/
                    customMapStyle={(waypoints.length < 2)?(theme.mapStyle):(theme.mapStyle.concat(mapStyle.compact))}
                    >
                    {(routes) && (
                        <Polyline coordinates={routes.polyline} fillColor={theme.brand} strokeColor={theme.brand} strokeWidth={4}/>
                    )}

                    <MapRouteMarkers waypoints={JSON.stringify(waypoints)}/>

                    <Polyline coordinates={[...global.coordinates]} fillColor={theme.brand} strokeColor={theme.brand} strokeWidth={4} lineJoin={"round"}/>

                    {/*waypoints.map((waypoint, index) => (
                        <Marker key={index} coordinate={waypoint.location} pinColor={getWaypointColor(index, waypoints.length)}/>
                    ))*/}

                    {(drawingPolyline) && (
                        <Polyline coordinates={drawingPolyline} fillColor={theme.brand} strokeColor={theme.brand} strokeWidth={4} lineJoin="round"/>
                    )}
                </MapView>
            )}

            <RouteEditor
                mapRef={mapRef}
                mapLayout={mapLayout}
                initialLocation={initialLocation}
                waypoints={waypoints}
                routes={routes}
                onWaypoints={(newWaypoints) => setWaypoints(newWaypoints)}
                onSearchLayout={(rectangle) => setSearchLayout(rectangle)}
                onWaypointsLayout={(rectangle) => setWaypointsLayout(rectangle)}
                onDrawingPolyline={(drawingPolyline) => setDrawingPolyline(drawingPolyline)}
                onSave={() => {
                    createRoute(client, encode(routes.polyline.map((coordinate) => [ coordinate.latitude, coordinate.longitude ])), routes.distance, routes.duration, waypoints.map((waypoint) => {
                        return {
                            type: waypoint.type,
                            
                            searchPrediction: (waypoint.searchPrediction)?({
                                location: {
                                    latitude: waypoint.searchPrediction.location.latitude,
                                    longitude: waypoint.searchPrediction.location.longitude
                                },
                                name: waypoint.searchPrediction.name,
                                placeId: waypoint.searchPrediction.placeId ?? null
                            }):(undefined),

                            path: (waypoint.path)?({
                                original: encode(waypoint.path.original.map((coordinate) => [ coordinate.latitude, coordinate.longitude ])),
                                route: encode(waypoint.path.route.map((coordinate) => [ coordinate.latitude, coordinate.longitude ])),
                                distance: waypoint.path.distance,
                                duration: waypoint.path.duration
                            }):(undefined)
                        };
                    })).then((result) => {
                        if(result.success) {
                            setWaypoints([]);
                            setRoutes(null);
                        }
                    })
                }}>
                {(!waypoints.length) && (
                    <View style={{
                        backgroundColor: theme.background,

                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                    }}>
                        <ResizableView initialHeight={250} height={height} onHeight={(height) => setHeight(height)} headerStyle={{ marginBottom: -10 }}>
                            <Tabs initialTab="routes">
                                <TabsPage id="routes" title="My routes" style={{ flex: 1 }}>
                                    <RoutesList/>
                                </TabsPage>

                                <TabsPage id={"global"} title="Global routes" style={{ flex: 1 }}>
                                </TabsPage>
                            </Tabs>
                        </ResizableView>
                    </View>
                )}
            </RouteEditor>


            {(!initialLocation && permissions?.granted) && (
                <View style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%",

                    backgroundColor: "rgba(0, 0, 0, .6)",

                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <HeaderText style={{ color: "white" }}>Getting your location...</HeaderText>
                </View>
            )}

            {(internetConnection === "OFFLINE")?(
                <OfflinePageOverlay/>
            ):((!userData.user?.subscribed)?(
                <PageOverlay/>
            ):((permissions !== null && !permissions.granted) && (
                <PermissionsPageOverlay required={[ "foreground" ]} onGranted={(permissions) => setPermissions(permissions)}/>
            )))}
        </View>
    );
}
