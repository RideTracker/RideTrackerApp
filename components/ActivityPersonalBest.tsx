import React from "react";
import { Image } from "react-native";

type ActivityPersonalBestProps = {
    scale: number;
};

export function ActivityPersonalBest(props: ActivityPersonalBestProps) {
    const { scale } = props;

    return (
        <React.Fragment>
            <Image source={require("../assets/images/laurel-wreath.png")} style={{
                position: "absolute",
                
                left: -8 * scale,
                bottom: -3 * scale,

                width: scale * 50,
                height: scale * 45,
            }} resizeMode="contain"/>

            <Image source={require("../assets/images/laurel-wreath.png")} style={{
                position: "absolute",
                
                right: -8 * scale,
                bottom: -3 * scale,

                transform: [
                    {
                        rotateY: "180deg"
                    }
                ],

                width: scale * 50,
                height: scale * 45,
            }} resizeMode="contain"/>
        </React.Fragment>
    );
};
