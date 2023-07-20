import MapView, { Point } from "react-native-maps";
import { View, Dimensions } from "react-native";
import { useMapStyle, useTheme } from "../../utils/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBounds, getCenterOfBounds } from "geolib";
import { Coordinate } from "../../models/Coordinate";
import { decode } from "@googlemaps/polyline-codec";
import { useUser } from "../../modules/user/useUser";
import ActivityDataMapPolyline, { ActivityDataMapPolylineProps } from "./ActivityDataMapPolyline";

export type ActivityDataMapProps = {
    activity: {
        polylines?: string[];
    };
};

function distance(point1, point2) {
    // Calculate the Euclidean distance between two points
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
  }
  
  function removeClosePoints(points, scale) {
    // Create a copy of the points array to avoid modifying the original array
    let filteredPoints = points.slice();
  
    // Iterate through the points and check distances
    for (let i = filteredPoints.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        // Check the distance between points[i] and points[j]
        if (distance(filteredPoints[i], filteredPoints[j]) < 1 / scale) {
          // Remove one of the points (you can choose which one to remove)
          filteredPoints.splice(i, 1);
          break; // Break the inner loop as we have already removed the point
        }
      }
    }
  
    return filteredPoints;
  }

export default function ActivityDataMap({ activity }: ActivityDataMapProps) {
    const theme = useTheme();
    const mapStyle = useMapStyle();
    const userData = useUser();

    const mapViewRef = useRef<MapView>();
    
    const [ polylines, setPolylines ] = useState<ActivityDataMapPolylineProps["polylines"]>([]);

    useEffect(() => {
        handleRegionChangeComplete();
    }, [ activity ]);

    const handleRegionChangeComplete = useCallback(() => {
        if(!activity?.polylines)
            return;

        requestAnimationFrame(async () => {
            const scale = Dimensions.get("screen").scale;

            const polylines = await Promise.all<ActivityDataMapPolylineProps["polylines"][0]>(activity.polylines.map(async (polyline) => {
                const coordinates = decode(polyline, 5).map((coordinate) => {
                    return {
                        latitude: coordinate[0],
                        longitude: coordinate[1]
                    };
                });

                return {
                    coordinates,
                    points: removeClosePoints(await Promise.all(coordinates.map(async (coordinate) => await mapViewRef.current.pointForCoordinate(coordinate))), scale)
                };
            }));

            const coordinates = polylines.flatMap((polyline) => polyline.coordinates);

            mapViewRef.current.fitToCoordinates(coordinates, {
                animated: false,
                edgePadding: {
                    left: 10,
                    top: 10,
                    right: 10,
                    bottom: 20
                }
            });

            setPolylines(polylines);
        });
    }, [ activity, mapViewRef ]);

    return (
        <View style={{
            flex: 1,
            borderRadius: 10,
            overflow: "hidden",

            position: "relative"
        }}>
            <MapView
                ref={mapViewRef}
                customMapStyle={theme.mapStyle.concat(mapStyle.compact)}
                onRegionChangeComplete={handleRegionChangeComplete}
                style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%"
                }}
                provider={userData.mapProvider}
            >
            </MapView>

            <ActivityDataMapPolyline polylines={polylines}/>
        </View>
    );
};
