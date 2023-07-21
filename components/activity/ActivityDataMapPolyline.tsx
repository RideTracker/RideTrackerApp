import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { View, Dimensions } from "react-native";
import MapView, { Point, Region } from "react-native-maps";
import { Coordinate } from "../../models/Coordinate";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import Expo2DContext from "expo-2d-context";
import { useTheme } from "../../utils/themes";
import { scale } from "chroma.ts";
import { decode } from "@googlemaps/polyline-codec";
import getStrippedPolylineByPoints from "../../controllers/polylines/getStrippedPolylineByPoints";
import getFurthestCoordinate from "../../controllers/polylines/getFurthestCoordinate";
import { getCenter, getRhumbLineBearing } from "geolib";

export type ActivityDataMapPolylineProps = {
    mapViewRef: MutableRefObject<MapView>;

    region: Region;
    polylines: Coordinate[][];

    getCoordinateFraction: (index: number, polyline: number) => number;
}

export default function ActivityDataMapPolyline({ mapViewRef, region, polylines, getCoordinateFraction }: ActivityDataMapPolylineProps) {
    const theme = useTheme();
    
    const [ context, setContext ] = useState<Expo2DContext>(null);
    const [ processedPolylines, setProcessedPolylines ] = useState<{
        coordinates: Coordinate[];
        points: (Point & {
            coordinateIndex: number;
        })[];
    }[]>(null);

    useEffect(() => {
        if(polylines) {
            const dimensions = Dimensions.get("screen");

            Promise.all(polylines.map(async (polyline) => {
                const coordinates = polyline;

                const points = getStrippedPolylineByPoints(await Promise.all(coordinates.map(async (coordinate, index) => {
                    const point = await mapViewRef.current.pointForCoordinate(coordinate);

                    return {
                        x: Math.round(point.x),
                        y: Math.round(point.y),
                        coordinateIndex: index
                    }
                })), 1 / dimensions.scale);

                return {
                    coordinates,
                    points
                };
            })).then((polylines) => {
                const coordinates = polylines.flatMap((polyline) => polyline.coordinates);

                const startCoordinate = coordinates[0];
                const furthestCoordinate = getFurthestCoordinate(coordinates);

                mapViewRef.current.fitToCoordinates(coordinates, {
                    animated: false,
                    edgePadding: {
                        left: 20,
                        top: 20,
                        right: 20,
                        bottom: 20
                    }
                });

                mapViewRef.current.setCamera({
                    ...mapViewRef.current.getCamera(),
                    heading: getRhumbLineBearing(startCoordinate, furthestCoordinate) + 90 + 180
                });
    
                setProcessedPolylines(polylines);
            });
        }
    }, [ region, polylines ]);

    useEffect(() => {
        if(processedPolylines)
            handleRender();
    }, [ processedPolylines ]);

    const handleRender = useCallback(() => {
        if(processedPolylines && context) {
            const dimensions = Dimensions.get("screen");

            context.lineCap = "round";
            
            processedPolylines.forEach((polyline) => {
                context.strokeStyle = "white";
                context.lineWidth = (dimensions.scale * 1.2) / 3 * 5;

                context.beginPath();

                context.moveTo(polyline.points[0].x, polyline.points[0].y);

                for(let index = 1; index < polyline.points.length; index++) {
                    context.lineTo(polyline.points[index].x, polyline.points[index].y);
                }

                context.stroke();

                context.closePath();
            });

            let count = 0;

            const colorScale = scale([ "green", "orange", "red" ]);

            processedPolylines.forEach((polyline, polylineIndex) => {
                context.lineWidth = (dimensions.scale * 1.2) / 3 * 3;

                for(let index = 1; index < polyline.points.length; index++) {
                    context.strokeStyle = colorScale(getCoordinateFraction(polyline.points[index].coordinateIndex, polylineIndex)).toString();
                    context.beginPath();

                    context.moveTo(polyline.points[index - 1].x, polyline.points[index - 1].y);
                    context.lineTo(polyline.points[index].x, polyline.points[index].y);

                    context.stroke();
    
                    context.closePath();

                    count++;
                }
            });

            context.flush();
        }
    }, [ context, processedPolylines ]);

    const handleContextCreate = useCallback((gl) => {
        const context = new Expo2DContext(gl as any, {
            fastFillTesselation: true,
            maxGradStops: 128,
            renderWithOffscreenBuffer: true
        });

        const scale = Dimensions.get("screen").scale;
        context.scale(scale, scale);

        setContext(context);
    }, [ theme ]);

    return (
        <GLView key={JSON.stringify(polylines)} style={{
            position: "absolute",
            
            left: 0,
            top: 0,

            width: "100%",
            height: "100%"
        }} onContextCreate={handleContextCreate}>

        </GLView>
    );
};
