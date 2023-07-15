import React from "react";
import { Image } from "react-native";

export const BikeTypes = [
    {
        type: "road_bike",
        name: "Road Bike",
        icon: (<Image style={{ flex: 1, resizeMode: "contain" }} source={require("../assets/extras/bikes/road_bike.png")}/>)
    },
    
    {
        type: "mountain_bike",
        name: "Mountain Bike",
        icon: (<Image style={{ flex: 1, resizeMode: "contain" }} source={require("../assets/extras/bikes/mountain_bike.png")}/>)
    },
    
    {
        type: "fixed_gear",
        name: "Fixed Gear",
        icon: (<Image style={{ flex: 1, resizeMode: "contain" }} source={require("../assets/extras/bikes/fixed_gear.png")}/>)
    },
    
    {
        type: "touring_bike",
        name: "Touring Bike",
        icon: (<Image style={{ flex: 1, resizeMode: "contain" }} source={require("../assets/extras/bikes/touring_bike.png")}/>)
    },
    
    {
        type: "cruiser",
        name: "Cruiser",
        icon: (<Image style={{ flex: 1, resizeMode: "contain" }} source={require("../assets/extras/bikes/cruiser.png")}/>)
    }
];
