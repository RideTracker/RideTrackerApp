import React, { useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { View, PanResponder, Animated } from "react-native";

type DraggableProps = {
    children?: ReactNode;
    draggingChange: (dragging: boolean) => void;
    positionChange: (position: {
        location: {
            x: number;
            y: number;
        };

        scale: {
            left: number;
            top: number;
        };
    }) => void;

    lockVertical?: boolean;
    initialLeft?: number;
    initialTop?: number;
};

export function Draggable({ children, draggingChange, positionChange, lockVertical = false, initialLeft = 0, initialTop = 0 }: DraggableProps) {
    const [ dragging, setDragging ] = useState(false);

    const [ containerWidth, setContainerWidth ] = useState(0);
    const [ containerHeight, setContainerHeight ] = useState(0);

    const panResponder = useMemo(
        () => PanResponder.create({
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: () => {
            // Disable any existing animations
                draggableRef.current?.getLayout &&
                draggableRef.current?.stopAnimation();
            },
            onPanResponderMove: (event) => {
                if(!dragging)
                    setDragging(true);

                const location = {
                    x: Math.min(Math.max(0, event.nativeEvent.locationX), containerWidth),
                    y: (lockVertical)?(0):(Math.min(Math.max(0, event.nativeEvent.locationY), containerHeight))
                };

                // Set the position of the draggable element based on the gesture state
                Animated.event(
                    [
                        {
                            dx: draggablePosition.current.x,
                            dy: draggablePosition.current.y,
                        },
                    ],
                    {
                        useNativeDriver: false
                    }
                )({
                    dx: location.x,
                    dy: location.y
                });

                positionChange({
                    location,
                    scale: {
                        left: location.x / containerWidth,
                        top: location.y / containerHeight
                    }
                });
            },

            onPanResponderRelease() {
                setDragging(false);
            },

            onPanResponderEnd() {
                setDragging(false);
            },
        }), 
        [ containerWidth, containerHeight ]
    );

    useEffect(() => draggingChange(dragging), [ dragging ]);

    const draggablePosition = useRef(new Animated.ValueXY());

    const draggableRef = useRef(null);

    return (
        <View
            style={{
                flex: 1,
                position: "relative"
            }}
            onLayout={(event) => {
                setContainerWidth(event.nativeEvent.layout.width);
                setContainerHeight(event.nativeEvent.layout.height);

                draggablePosition.current.setValue({
                    x: initialLeft * event.nativeEvent.layout.width,
                    y: initialTop * event.nativeEvent.layout.height
                });
            }}
            {...panResponder.panHandlers}
        >
            <Animated.View
                ref={draggableRef}
                style={[
                    {
                        position: "absolute",
                        left: 0,
                        top: 0,
                    },
                    draggablePosition.current.getLayout(),
                ]}
                pointerEvents={"none"}
            >
                {children}
            </Animated.View>
        </View>
    );
}
