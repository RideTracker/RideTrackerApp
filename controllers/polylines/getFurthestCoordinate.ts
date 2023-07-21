import { getDistance } from "geolib";
import { Coordinate } from "../../models/Coordinate";

export default function getFurthestCoordinate(coordinates: Coordinate[]) {
    const start = coordinates[0];
    
    let currentPoint = null;
    let currentDistance = 0;

    for(let index = 1; index < coordinates.length; index++) {
        const distance = getDistance(start, coordinates[index]);

        if(distance > currentDistance) {
            currentPoint = coordinates[index];
            currentDistance = distance;
        }
    }

    return currentPoint;
};
