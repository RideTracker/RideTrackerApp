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

export type RoutesListProps = {
};

export function RoutesList({}: RoutesListProps) {
    const client = useClient();

    const [ items, setItems ] = useState<GetRoutesByUserFeedResponse["routes"]>([]);
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

                setItems((reset)?(result.routes):(items.concat(result.routes)));
                setOffset(result.offset);

                console.log("reset? " + reset);
                
                return (result.routes.length === result.limit);
            }}
            render={(route: { item: GetRoutesByUserFeedResponse["routes"][0] }) => {
                return (<RoutesListItem key={route.item.id} route={route.item}/>)
            }}
        />
    );
};
