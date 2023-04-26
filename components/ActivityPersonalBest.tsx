import React from "react";
import { Image } from "react-native";

export function ActivityPersonalBest() {
    return (
        <React.Fragment>
            <Image source={require("../assets/images/laurel-wreath.png")} style={{
                position: "absolute",
                
                left: -28,
                bottom: -3,

                width: 50,
                height: 45,
            }} resizeMode="contain"/>

            <Image source={require("../assets/images/laurel-wreath.png")} style={{
                position: "absolute",
                
                right: -28,
                bottom: -3,

                transform: [
                    {
                        rotateY: "180deg"
                    }
                ],

                width: 50,
                height: 45,
            }} resizeMode="contain"/>
        </React.Fragment>
    );
};
