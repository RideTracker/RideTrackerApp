import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, PanResponder, Animated } from "react-native";

export function Draggable({ children, draggingChange, positionChange, lockVertical = false }) {
    const [ dragging, setDragging ] = useState(false);

    const [ containerWidth, setContainerWidth ] = useState(0);
    const [ containerHeight, setContainerHeight ] = useState(0);

  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (_, gestureState) => {
        // Disable any existing animations
        draggableRef.current?.getLayout &&
          draggableRef.current?.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        if(!dragging)
            setDragging(true);

        const location = {
            x: Math.min(Math.max(0, _.nativeEvent.locationX), containerWidth),
            y: (lockVertical)?(0):(Math.min(Math.max(0, _.nativeEvent.locationY), containerHeight))
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

      onPanResponderEnd(e, gestureState) {
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
