import { ReactNode, useState, useEffect } from "react";
import { View, ViewStyle, LayoutRectangle, Dimensions, ScaledSize } from "react-native";
import { useTheme } from "../utils/themes";

export type ResizableViewProps = {
    steps: number[];
    initialHeight: number;
    headerStyle?: ViewStyle;
    children: ReactNode;
}

export default function ResizableView({ steps, initialHeight, headerStyle, children }: ResizableViewProps) {
    const theme = useTheme();

    const [ screen ] = useState<ScaledSize>(Dimensions.get("screen"));
    const [ layout, setLayout ] = useState<LayoutRectangle>(null);
    const [ start, setStart ] = useState<number>(null);
    const [ offsets, setOffsets ] = useState<{
        current: number;
        new: number;
    }>({ current: 0, new: 0 });

    let currentHeight = initialHeight - (offsets.current + offsets.new);

    const step = steps.reduce(function(previous, current) {
        return (Math.abs(current - (currentHeight / screen.height)) < Math.abs(previous - (currentHeight / screen.height)) ? current : previous);
    });

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
                onTouchStart={(event) => setStart(event.nativeEvent.pageY)}
                onTouchMove={(event) => {
                    if(start === null)
                        return;

                    setOffsets({
                        current: offsets.current,
                        new: event.nativeEvent.pageY - start
                    });
                }}
                onTouchEnd={(event) => {
                    setOffsets({
                        current: offsets.current + (event.nativeEvent.pageY - start),
                        new: 0
                    });

                    setStart(null);
                }}
                onLayout={(event) => {
                    if(!layout)
                        setLayout(event.nativeEvent.layout);
                }}
                >
                <View style={{
                    width: "60%",
                    height: 5,

                    borderRadius: 5,

                    backgroundColor: theme.border
                }}/>
            </View>

            <View style={{ height: Math.max(10, screen.height * step) }}>
                {children}
            </View>
        </View>
    )
};
