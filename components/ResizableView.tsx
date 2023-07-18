import { ReactNode, useState, useEffect } from "react";
import { View, ViewStyle, LayoutRectangle, Dimensions, ScaledSize } from "react-native";
import { useTheme } from "../utils/themes";

export type ResizableViewProps = {
    steps: number[];
    initialStep: number;
    headerStyle?: ViewStyle;
    children: ReactNode;
}

export default function ResizableView({ steps, initialStep, headerStyle, children }: ResizableViewProps) {
    const theme = useTheme();

    const [ screen ] = useState<ScaledSize>(Dimensions.get("screen"));
    const [ layout, setLayout ] = useState<LayoutRectangle>(null);

    const [ offsets, setOffsets ] = useState<{
        step: number;
        height: number;
        offset: number;
        start: number;
    }>({
        step: initialStep,
        height: screen.height * steps[initialStep],
        offset: 0,
        start: null
    });

    //let currentHeight = initialHeight - offset;

    /*if(!start) {
        const step = steps.reduce(function(previous, current) {
            return (Math.abs(current - (currentHeight / screen.height)) < Math.abs(previous - (currentHeight / screen.height)) ? current : previous);
        });

        currentHeight = Math.max(10, screen.height * step);
    }*/

    //console.log({ currentHeight });

    return (
        <View style={{
            flexDirection: "column"
        }}>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",

                    padding: 10,

                    zIndex: 1,

                    ...headerStyle
                }}
                onTouchStart={(event) => setOffsets({ ...offsets, start: event.nativeEvent.pageY })}
                onTouchMove={(event) => {
                    if(offsets.start === null)
                        return;

                    setOffsets({
                        ...offsets,
                        offset: offsets.start - event.nativeEvent.pageY
                    });
                }}
                onTouchEnd={(event) => {
                    let newStep = offsets.step;
                    
                    if(offsets.offset > 0)
                        newStep++;
                    else if(offsets.offset < 0)
                        newStep--;

                    newStep = Math.max(Math.min(newStep, steps.length - 1), 0);
            
                    setOffsets({
                        height: Math.max(10, screen.height * steps[newStep]),
                        start: null,
                        offset: 0,
                        step: newStep
                    });
                }}
                /*onLayout={(event) => {
                    if(!layout)
                        setLayout(event.nativeEvent.layout);
                }}*/
                >
                <View style={{
                    width: "60%",
                    height: 5,

                    borderRadius: 5,

                    backgroundColor: theme.border
                }}/>
            </View>

            <View style={{ height: Math.min(offsets.height + offsets.offset, screen.height * steps[steps.length - 1]) }}>
                {children}
            </View>
        </View>
    )
};
