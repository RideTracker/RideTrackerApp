import { Point } from "react-native-maps";
import { getDistanceBetweenPoints } from "./getDistanceBetweenPoints";

export default function getStrippedPolylineByPoints(points: Point[], distance: number): (any & Point)[] {
    // Create a copy of the points array to avoid modifying the original array
    let filteredPoints = points.slice();

    // Iterate through the points and check distances
    for (let i = filteredPoints.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            // Check the distance between points[i] and points[j]
            if (getDistanceBetweenPoints(filteredPoints[i], filteredPoints[j]) <= distance) {
                // Remove one of the points (you can choose which one to remove)
                filteredPoints.splice(i, 1);
                break; // Break the inner loop as we have already removed the point
            }
        }
    }

    return filteredPoints;
};
