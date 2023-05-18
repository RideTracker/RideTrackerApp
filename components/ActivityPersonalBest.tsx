import React from "react";
import { Image } from "react-native";

type ActivityPersonalBestProps = {
    fontSizeScale: number;
};

export function ActivityPersonalBest(props: ActivityPersonalBestProps) {
    const { fontSizeScale } = props;

    return (
        <React.Fragment>
            <Image source={require("../assets/images/laurel-wreath.png")} style={{
                position: "absolute",
                
                left: -8 * fontSizeScale,
                bottom: -3 * fontSizeScale,

                width: fontSizeScale * 50,
                height: fontSizeScale * 45,
            }} resizeMode="contain"/>

            <Image source={require("../assets/images/laurel-wreath.png")} style={{
                position: "absolute",
                
                right: -8 * fontSizeScale,
                bottom: -3 * fontSizeScale,

                transform: [
                    {
                        rotateY: "180deg"
                    }
                ],

                width: fontSizeScale * 50,
                height: fontSizeScale * 45,
            }} resizeMode="contain"/>
        </React.Fragment>
    );
};
