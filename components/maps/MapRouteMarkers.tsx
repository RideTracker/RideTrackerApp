import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import { SearchPrediction } from "../../models/SearchPrediction";
import { ParagraphText } from "../texts/Paragraph";
import { CaptionText } from "../texts/Caption";
import uuid from "react-native-uuid";
import getFormattedWords from "../../controllers/getFormattedWords";
import MapStartFinishMarker from "./MapStartFinishMarker";
import MapStartMarker from "./MapStartMarker";
import MapFinishMarker from "./MapFinishMarker";
import MapIntermediateMarker from "./MapIntermediateMarker";

type MapRouteMarker = {
    id: string;
    name: string;
    types: string[];
    location: {
        latitude: number;
        longitude: number;
    };
};

type MapRouteMarkersProps = {
    waypoints: SearchPrediction[];
};

export function getMarkersFromWaypoints(waypoints: SearchPrediction[]) {
    const markers: MapRouteMarker[] = [];

    waypoints.filter((waypoint) => waypoint.location).forEach((waypoint, index) => {
        const marker = markers.find((marker) => {
            return marker.name === waypoint.name;
        });

        const type = (index === 0)?("Start"):((index === waypoints.length - 1)?("Finish"):("Intermediate"));

        if(!marker) {
            markers.push({
                id: uuid.v4() as string,
                name: waypoint.name,
                types: [ type ],
                location: waypoint.location
            });
        }
        else
            marker.types.push(type)
    });

    return markers;
};

export default function MapRouteMarkers({ waypoints }: MapRouteMarkersProps) {
    const [ markers, setMarkers ] = useState<MapRouteMarker[]>(getMarkersFromWaypoints(waypoints));

    useEffect(() => {
        setMarkers(getMarkersFromWaypoints(waypoints));
    }, [ waypoints.length ]);

    return (
        <React.Fragment>
            {markers.map((marker, index) => {
                const type = getFormattedWords(marker.types);

                return (
                    <React.Fragment key={marker.id}>
                        <Marker coordinate={marker.location} style={{ flexDirection: "row" }}>
                            <View style={{ opacity: 0, paddingRight: 30 }}>
                                <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: "#FFF", textShadowColor: "#000", textShadowRadius: 2 }}>{type}</ParagraphText>

                                <CaptionText style={{ textTransform: "uppercase", fontStyle: "italic", color: "#FFF", textShadowColor: "#000", textShadowRadius: 2, fontWeight: "600" }}>{marker.name}</CaptionText>
                            </View>

                            <View>
                                <ParagraphText style={{ textTransform: "uppercase", fontStyle: "italic", color: "#FFF", textShadowColor: "#000", textShadowRadius: 2 }}>{type}</ParagraphText>

                                <CaptionText style={{ textTransform: "uppercase", fontStyle: "italic", color: "#FFF", textShadowColor: "#000", textShadowRadius: 2, fontWeight: "600" }}>{marker.name}</CaptionText>
                            </View>
                        </Marker>

                        {(marker.types.includes("Start"))?(
                            (marker.types.includes("Finish"))?(
                                <MapStartFinishMarker coordinate={marker.location}/>
                            ):(
                                <MapStartMarker coordinate={marker.location}/>
                            )
                        ):((marker.types.includes("Finish"))?(
                            <MapFinishMarker coordinate={marker.location}/>
                        ):(
                            <MapIntermediateMarker coordinate={marker.location}/>
                        ))}
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
};
