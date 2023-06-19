import { SearchPrediction } from "../models/SearchPrediction";

function getFormattedWaypointUrl(waypoint: SearchPrediction) {
    if(waypoint.placeId)
        return waypoint.name;

    if(waypoint.location)
        return `${waypoint.location.latitude},${waypoint.location.longitude}`;

    return waypoint.name;
};

export default function getGoogleMapsDirectionsUrl(waypoints: SearchPrediction[]) {
    const url = new URL("https://www.google.com/maps/dir/");
    url.searchParams.append("api", "1");
    url.searchParams.append("travelmode", "bicycling");

    url.searchParams.append("origin", getFormattedWaypointUrl(waypoints[0]));

    if(waypoints[0].placeId)
        url.searchParams.append("origin_place_id", waypoints[0].placeId);
        
    url.searchParams.append("destination", getFormattedWaypointUrl(waypoints[waypoints.length - 1]));

    if(waypoints[waypoints.length - 1].placeId)
        url.searchParams.append("destination_place_id", waypoints[waypoints.length - 1].placeId);

    if(waypoints.length > 2) {
        url.searchParams.append("waypoints", waypoints.slice(1, waypoints.length - 1).flatMap((waypoint) => getFormattedWaypointUrl(waypoint)).join('|'));
        url.searchParams.append("waypoint_place_ids", waypoints.slice(1, waypoints.length - 1).flatMap((waypoint) => String(waypoint.placeId)).join('|'));
    }

    console.log(url);

    return url.toString();
};
