import { RoutePath, RouteWaypoint } from "../app/(root)/(auth)/(tabs)/(subscription)/routes";
import { SearchPrediction } from "../models/SearchPrediction";

function getFormattedWaypointUrl(waypoint: Partial<SearchPrediction>) {
    if(waypoint.placeId)
        return waypoint.name;

    if(waypoint.location)
        return `${waypoint.location.latitude},${waypoint.location.longitude}`;

    return waypoint.name;
};

function getFormattedCoordinateUrl(coordinate: {
    latitude: number;
    longitude: number;
    }) {
    return `${coordinate.latitude},${coordinate.longitude}`;
};

export default function getGoogleMapsDirectionsUrl(waypoints: RouteWaypoint[]) {
    const url = new URL("https://www.google.com/maps/dir/");
    url.searchParams.append("api", "1");
    url.searchParams.append("travelmode", "bicycling");

    let intermediates: Partial<SearchPrediction>[] = [];

    if(waypoints[0].type === "SEARCH_PREDICTION") {
        url.searchParams.append("origin", getFormattedWaypointUrl(waypoints[0].searchPrediction));
        
        if(waypoints[0].searchPrediction.placeId)
            url.searchParams.append("origin_place_id", waypoints[0].searchPrediction.placeId);
    }
    else if(waypoints[0].type === "PATH") {
        url.searchParams.append("origin", getFormattedCoordinateUrl(waypoints[0].path.original[0]));

        for(let index = 1; index < waypoints[0].path.original.length; index++)
            intermediates.push({ location: waypoints[0].path.original[index] });
    }
        
    if(waypoints.length > 1) {
        if(waypoints.length > 2) {
            waypoints.slice(1, waypoints.length - 1).forEach((waypoint) => {
                if(waypoint.type === "SEARCH_PREDICTION") {
                    intermediates.push({
                        location: waypoint.searchPrediction.location,
                        placeId: waypoint.searchPrediction.placeId
                    });
                }
                else if(waypoint.type === "PATH") {
                    for(let index = 0; index < waypoint.path.original.length; index++)
                        intermediates.push({ location: waypoint.path.original[index] });
                }
            });
        }

        if(waypoints[waypoints.length - 1].type === "SEARCH_PREDICTION") {
            url.searchParams.append("destination", getFormattedWaypointUrl(waypoints[waypoints.length - 1].searchPrediction));
            
            if(waypoints[waypoints.length - 1].searchPrediction.placeId)
                url.searchParams.append("destination_place_id", waypoints[waypoints.length - 1].searchPrediction.placeId);
        }
        else if(waypoints[waypoints.length - 1].type === "PATH") {
            url.searchParams.append("destination", getFormattedCoordinateUrl(waypoints[waypoints.length - 1].path.original[waypoints[waypoints.length - 1].path.original.length - 1]));
    
            for(let index = 0; index < waypoints[waypoints.length - 1].path.original.length - 1; index++)
                intermediates.push({ location: waypoints[waypoints.length - 1].path.original[index] });
        }
    }

    if(intermediates.length > 2) {
        url.searchParams.append("waypoints", intermediates.flatMap((waypoint) => getFormattedWaypointUrl(waypoint)).join('|'));
        url.searchParams.append("waypoint_place_ids", intermediates.flatMap((waypoint) => String(waypoint.placeId)).join('|'));
    }

    console.log(url);

    return url.toString();
};
