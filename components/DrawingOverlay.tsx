import Expo2DContext, { ImageData } from "expo-2d-context";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { useCallback, useEffect, useState } from "react";
import { GestureResponderEvent, View, Dimensions } from "react-native";
import { useTheme } from "../utils/themes";
import MapView from "react-native-maps";
import { getDistance, getGreatCircleBearing, getRhumbLineBearing } from "geolib";
import { useClient } from "../modules/useClient";
import { getMapsRoutes } from "@ridetracker/ridetrackerclient";
import { decode } from "@googlemaps/polyline-codec";

export type DrawingPolyline = {
    latitude: number;
    longitude: number;
}[];

export type DrawingState = "POLYLINE_UPDATE" | "POLYLINE_FINISH";

export type DrawingOverlayProps = {
    mapRef: React.MutableRefObject<MapView>;

    onUpdate: (state: DrawingState, polyline: DrawingPolyline) => void;
};

export default function DrawingOverlay({ mapRef, onUpdate }: DrawingOverlayProps) {
    const theme = useTheme();
    const client = useClient();

    const [ locations, setLocations ] = useState<{
        left: number;
        top: number;
    }[]>([]);

    const [ context, setContext ] = useState<Expo2DContext>(null);
    const [ drawing, setDrawing ] = useState<boolean>(false);

    const handleContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
        const context = new Expo2DContext(gl as any, {
            fastFillTesselation: true,
            maxGradStops: 128,
            renderWithOffscreenBuffer: true
        });

        const scale = Dimensions.get("screen").scale;
        context.scale(scale, scale);

        context.strokeStyle = theme.brand;
        context.lineWidth = scale * 1.4;
        context.lineCap = "round";

        if(locations.length) {
            context.beginPath();

            context.moveTo(locations[0].left, locations[0].top);

            for(let index = 1; index < locations.length; index++)
               context.lineTo(locations[index].left, locations[index].top);

            context.stroke();
            context.flush();
        }

        setContext(context);
    }, []);

    const handleTouchStart = useCallback((event: GestureResponderEvent) => {
        const location = {
            left: event.nativeEvent.locationX,
            top: event.nativeEvent.locationY
        };

        setLocations([]);
        setDrawing(true);
        onUpdate("POLYLINE_UPDATE", []);

        if(context) {
            context.beginPath();

            context.moveTo(location.left, location.top);
        }
    }, [ context ]);
    
    const handleTouchMove = useCallback((event: GestureResponderEvent) => {
        const location = {
            left: Math.round(event.nativeEvent.locationX),
            top: Math.round(event.nativeEvent.locationY)
        };

        setLocations(locations.concat(location));

        if(context) {
            context.lineTo(location.left, location.top);

            context.stroke();
            context.flush();
        }
    }, [ context, locations ]);
    
    const handleTouchEnd = useCallback((event: GestureResponderEvent) => {
        const coordinates = Array(locations.length);

        Promise.all(locations.map(async (location, index) => {
            coordinates[index] = await mapRef.current.coordinateForPoint({
                x: location.left,
                y: location.top
            });
        })).then(() => {
            onUpdate("POLYLINE_UPDATE", coordinates);

            handleRouteOptimization(coordinates);
            
            setDrawing(false);
            setContext(null);
        });
    }, [ locations ]);

    const handleRouteOptimization = useCallback((coordinates: DrawingPolyline) => {
        // optimize path to only include those points where there's more than 100m distance and more than 10 degree banking
        const optimizedCoordinates = [];

        let previousIndex = 0;
        
        for(let index = 1; index < coordinates.length - 1; index++) {
            if(getDistance(coordinates[previousIndex], coordinates[index]) >= 200) {
                previousIndex = index;

                optimizedCoordinates.push(coordinates[index]);
            }
        }

        onUpdate("POLYLINE_UPDATE", [
            coordinates[0],
            ...optimizedCoordinates,
            coordinates[coordinates.length - 1]
        ]);

        const bankedCoordinates = [];

        let previousAngle = getRhumbLineBearing(optimizedCoordinates[0], optimizedCoordinates[1]);

        for(let index = 1; index < optimizedCoordinates.length - 1; index++) {
            const angle = getRhumbLineBearing(optimizedCoordinates[index - 1], optimizedCoordinates[index]);

            const difference = Math.abs(angle - previousAngle);

            console.log({ difference });

            if(difference > 20) {
                previousAngle = angle;

                bankedCoordinates.push(optimizedCoordinates[index]);
            }
        }

        onUpdate("POLYLINE_UPDATE", [
            coordinates[0],
            ...bankedCoordinates,
            coordinates[coordinates.length - 1]
        ]);

        let limitedCoordinates = bankedCoordinates;

        if(bankedCoordinates.length >= 10) {
            limitedCoordinates = bankedCoordinates.map((coordinate, index) => {
                return {
                    coordinate,
                    index,
                    distance: (index !== 0)?(getDistance(bankedCoordinates[index - 1], coordinate)):(getDistance(coordinates[0], coordinate))
                };
            }).sort((a, b) => b.distance - a.distance).slice(0, 24).sort((a, b) => a.index - b.index).map((coordinate) => coordinate.coordinate);

            onUpdate("POLYLINE_UPDATE", [
                coordinates[0],
                ...limitedCoordinates,
                coordinates[coordinates.length - 1]
            ]);
        }

        console.log({ original: coordinates.length, optimized: optimizedCoordinates.length, banked: bankedCoordinates.length, limited: limitedCoordinates.length });

        onUpdate("POLYLINE_FINISH", [
            coordinates[0],
            ...limitedCoordinates,
            coordinates[coordinates.length - 1]
        ]);
    }, []);

    return (
        <View
            style={{
                position: "absolute",

                left: 0,
                top: 0,

                width: "100%",
                height: "100%"
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            {(drawing) && (<GLView style={{ flex: 1 }} onContextCreate={handleContextCreate}/>)}
        </View>
    );
};
