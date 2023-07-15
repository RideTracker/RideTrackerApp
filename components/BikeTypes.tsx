import React from "react";
import { Image } from "react-native";
import { ParagraphText } from "./texts/Paragraph";

export const BikeTypes = [
    {
        type: "road_bike",
        name: "Road Bike",
        image: require("../assets/extras/bikes/road_bike.png")
    },
    
    {
        type: "mountain_bike",
        name: "Mountain Bike",
        image: require("../assets/extras/bikes/mountain_bike.png")
    },
    
    {
        type: "fixed_gear",
        name: "Fixed Gear",
        image: require("../assets/extras/bikes/fixed_gear.png")
    },
    
    {
        type: "touring_bike",
        name: "Touring Bike",
        image: require("../assets/extras/bikes/touring_bike.png")
    },
    
    {
        type: "cruiser",
        name: "Cruiser",
        image: require("../assets/extras/bikes/cruiser.png")
    }
];

export type BikeTypeProps = {
    type: string;
    color: string;
    withName?: boolean;
}

export default function BikeType({ type, color, withName }: BikeTypeProps) {
    const bikeType = BikeTypes.find((bikeType) => bikeType.type == type);

    if(!bikeType)
        return null;

    return (
        <React.Fragment>
            <Image style={{ flex: 1, resizeMode: "contain", tintColor: color }} source={bikeType.image}/>

            {(withName) && (
                <ParagraphText style={{ color }}>{bikeType.name}</ParagraphText>
            )}
        </React.Fragment>
    );
};
