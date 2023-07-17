import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useClient } from "../modules/useClient";
import { GetRoutesByUserFeedResponse, getRoutesByUserFeed } from "@ridetracker/ridetrackerclient";
import { Pagination } from "./Pagination";
import { useRouter } from "expo-router";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import MapView, { Polyline } from "react-native-maps";
import { decode } from "@googlemaps/polyline-codec";
import { RoutesListItem } from "./RouteListItem";
import FlatPagination from "./FlatPagination";
import { Coordinate } from "../models/Coordinate";
import getRandomThemeColor from "../controllers/getJsonColor";

export type RoutesListProps = {
    onViewableRoutesChanged: (routes: RouteListRouteData[]) => void;
};

export type RouteListRouteData = GetRoutesByUserFeedResponse["routes"][0] & {
    decodedPolyline: Coordinate[];
};

export function RoutesList({ onViewableRoutesChanged }: RoutesListProps) {
    const client = useClient();

    const [ items, setItems ] = useState<RouteListRouteData[]>([]);
    const [ offset, setOffset ] = useState<number>(0);

    return (
        <FlatPagination
            style={{
                padding: 10
            }}
            data={items}
            paginate={async (reset) => {
                const result = await getRoutesByUserFeed(client, (reset)?(0):(offset));

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
                return (<RoutesListItem key={route.item.id} route={route.item}/>)
            }}
            onViewableItemsChanged={(routes: RouteListRouteData[]) => onViewableRoutesChanged(routes)}
        />
    );
};
