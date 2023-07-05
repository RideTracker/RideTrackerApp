import React from "react";
import { Image } from "react-native";

const laurelWreathImages = {
    "white": require("../assets/images/laurel-wreath-white.png"),
    "black": require("../assets/images/laurel-wreath-black.png")
};

type ActivityPersonalBestProps = {
    scale: number;
    color?: "white" | "black";
};

export function ActivityPersonalBest({ scale, color }: ActivityPersonalBestProps) {
    if(!color)
        color = "white";

    return (
        <React.Fragment>
            <Image source={laurelWreathImages[color]} style={{
                position: "absolute",
                
                left: -8 * scale,
                bottom: -3 * scale,

                width: scale * 50,
                height: scale * 45,
            }} resizeMode="contain"/>

            <Image source={laurelWreathImages[color]} style={{
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
}
