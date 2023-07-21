import { getDistance } from "geolib";
import { Coordinate } from "../../models/Coordinate";

export default function getClosestCoordinate(coordinate: Coordinate, coordinates: Coordinate[]) {
    let currentIndex = 0;
    let currentDistance = Infinity;

    for(let index = 0; index < coordinates.length; index++) {
        const distance = getDistance(coordinate, coordinates[index]);

        if(distance < currentDistance) {
            currentIndex = index;
            currentDistance = distance;
        }
    }

    return currentIndex;
};
