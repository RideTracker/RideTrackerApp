import React, { useCallback, useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import { Point } from "react-native-maps";
import { Coordinate } from "../../models/Coordinate";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import Expo2DContext from "expo-2d-context";
import { useTheme } from "../../utils/themes";
import { scale } from "chroma.ts";

export type ActivityDataMapPolylineProps = {
    polylines: {
        coordinates: Coordinate[];
        points: Point[];
    }[];
}

export default function ActivityDataMapPolyline({ polylines }: ActivityDataMapPolylineProps) {
    const theme = useTheme();
    
    const [ context, setContext ] = useState<Expo2DContext>(null);

    useEffect(() => {
        if(context) {
            const dimensions = Dimensions.get("screen");

            context.lineCap = "round";
            
            polylines.forEach((polyline) => {
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
            const items = polylines.reduce((accumulated, polyline) => accumulated + (polyline.points.length - 1), 0);

            const colorScale = scale([ "green", "orange", "red" ]);

            polylines.forEach((polyline) => {
                context.lineWidth = (dimensions.scale * 1.2) / 3 * 3;

                for(let index = 1; index < polyline.points.length; index++) {
                    context.strokeStyle = colorScale(Math.random()).toString();
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
    }, [ context, polylines ]);

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
