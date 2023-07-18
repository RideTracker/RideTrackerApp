import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useClient } from "../modules/useClient";
import { GetRoutesByFeedResponse, GetRoutesByUserFeedResponse, getRoutesByFeed, getRoutesByUserFeed } from "@ridetracker/ridetrackerclient";
import { Pagination } from "./Pagination";
import { useRouter } from "expo-router";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import MapView, { Polyline, Region } from "react-native-maps";
import { decode } from "@googlemaps/polyline-codec";
import { RoutesListItem } from "./RouteListItem";
import FlatPagination from "./FlatPagination";
import { Coordinate } from "../models/Coordinate";
import getRandomThemeColor from "../controllers/getJsonColor";

export type RoutesUserList = {
    type: "USER";
};

export type RoutesGlobalList = {
    type: "GLOBAL";
    mapRef: React.MutableRefObject<MapView>;
    mapRegion: Region; 
};

export type RoutesListProps = (RoutesUserList | RoutesGlobalList) & {
    onViewableRoutesChanged: (routes: RouteListRouteData[]) => void;
    onRoutePress: (route: RouteListRouteData) => void;
};

export type RouteListRouteData = GetRoutesByUserFeedResponse["routes"][0] & {
    user?: GetRoutesByFeedResponse["routes"][0]["user"];
    decodedPolyline: Coordinate[];
};

export function RoutesList(props: RoutesListProps) {
    const { type, onViewableRoutesChanged, onRoutePress } = props;

    const client = useClient();

    const [ items, setItems ] = useState<RouteListRouteData[]>([]);
    const [ offset, setOffset ] = useState<number>(0);

    useEffect(() => {
        onViewableRoutesChanged(items);
    }, [ items ]);

    const handlePagination = useCallback(async (offset: number) => {
        if(type === "USER")
            return getRoutesByUserFeed(client, offset);

        if(type === "GLOBAL") {
            const { mapRef } = props;

            const bounds = await mapRef.current.getMapBoundaries();

            const coordinateBounds = {
                latitude: {
                    north: bounds.northEast.latitude,
                    south: bounds.southWest.latitude
                },

                longitude: {
                    west: bounds.southWest.longitude,
                    east: bounds.northEast.longitude
                }
            };

            console.log(JSON.stringify(coordinateBounds, undefined, 4));

            return getRoutesByFeed(client, offset, coordinateBounds);
        }
    }, [ client, type ]);

    return (
        <FlatPagination
            key={(type === "GLOBAL")?(JSON.stringify(props.mapRegion)):(undefined)}
            style={{
                padding: 10
            }}
            data={items}
            paginate={async (reset) => {
                const result = await handlePagination((reset)?(0):(offset));

                if(!result.success)
                    return false;

                const newRoutes = result.routes.map((route) => {
                    return {
                        ...route,

                        decodedPolyline: decode(route.polyline).map((coordinate) => {
                            return {
                                latitude: coordinate[0],
                                longitude: coordinate[1]
                            };
                        })
                    };
                })

                setItems((reset)?(newRoutes):(items.concat(newRoutes)));
                setOffset(result.offset);

                console.log("reset? " + reset);
                
                return (result.routes.length === result.limit);
            }}
            render={(route: { item: RouteListRouteData }) => {
                return (<RoutesListItem key={route.item.id} route={route.item} onPress={() => onRoutePress(route.item)}/>)
            }}
            onViewableItemsChanged={(routes: RouteListRouteData[]) => {
                //if(routes.length > 1 || items.length <= routes.length) {
                //    onViewableRoutesChanged(routes);
                //}
                //else
            }}
        />
    );
};
