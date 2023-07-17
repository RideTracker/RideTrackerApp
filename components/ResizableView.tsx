import { ReactNode, useState } from "react";
import { View, ViewStyle, LayoutRectangle, Dimensions, ScaledSize } from "react-native";
import { useTheme } from "../utils/themes";

export type ResizableViewProps = {
    initialHeight: number;
    headerStyle?: ViewStyle;
    children: ReactNode;
}

export default function ResizableView({ initialHeight, headerStyle, children }: ResizableViewProps) {
    const theme = useTheme();

    const [ screen ] = useState<ScaledSize>(Dimensions.get("screen"));
    const [ layout, setLayout ] = useState<LayoutRectangle>(null);
    const [ start, setStart ] = useState<number>(null);
    const [ offsets, setOffsets ] = useState<{
        current: number;
        new: number;
    }>({ current: 0, new: 0 });

    let height = Math.min(Math.max((layout)?(layout.height):(0), initialHeight - (offsets.current + offsets.new)), screen.height * 0.5);

    if(Math.abs(initialHeight - height) < 20)
        height = initialHeight;

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

            <View style={{ height }}>
                {children}
            </View>
        </View>
    )
};
