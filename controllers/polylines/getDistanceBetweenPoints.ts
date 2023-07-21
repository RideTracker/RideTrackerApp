import { Point } from "react-native-maps";

export function getDistanceBetweenPoints(point1: Point, point2: Point) {
    // Calculate the Euclidean distance between two points
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
};
