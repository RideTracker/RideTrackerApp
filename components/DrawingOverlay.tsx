import Expo2DContext, { ImageData } from "expo-2d-context";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { useCallback, useEffect, useState } from "react";
import { GestureResponderEvent, View, Dimensions } from "react-native";
import { useTheme } from "../utils/themes";

export default function DrawingOverlay() {
    const theme = useTheme();

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
        context.lineWidth = scale * 2;
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

        setLocations([ location ]);
        setDrawing(true);

        if(context) {
            context.beginPath();

            context.moveTo(location.left, location.top);
        }
    }, [ context ]);
    
    const handleTouchMove = useCallback((event: GestureResponderEvent) => {
        const location = {
            left: event.nativeEvent.locationX,
            top: event.nativeEvent.locationY
        };

        setLocations(locations.concat(location));

        if(context) {
            context.lineTo(location.left, location.top);

            context.stroke();
            context.flush();
        }
    }, [ context, locations ]);
    
    const handleTouchEnd = useCallback((event: GestureResponderEvent) => {
        const location = {
            left: event.nativeEvent.locationX,
            top: event.nativeEvent.locationY
        };
        
        setLocations(locations.concat(location));
        setDrawing(false);
        setContext(null);
    }, [ locations ]);

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
            onTouchEndCapture={handleTouchEnd}
        >
            {(drawing) && (<GLView style={{ flex: 1 }} onContextCreate={handleContextCreate}/>)}
        </View>
    );
};
