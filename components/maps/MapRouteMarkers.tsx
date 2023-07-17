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
import { RouteWaypoint } from "../../app/(root)/(auth)/(tabs)/(subscription)/routes";
import { getDistance } from "geolib";

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
    waypoints: RouteWaypoint[];
};

export function getMarkersFromWaypoints(waypoints: RouteWaypoint[]) {
    const markers: MapRouteMarker[] = [];

    waypoints.forEach((waypoint, index) => {
        let type = (index === 0)?("Start"):((index === waypoints.length - 1)?("Finish"):("Intermediate"));

        if(waypoint.type === "SEARCH_PREDICTION") {
            const marker = markers.find((marker) => {
                return getDistance(marker.location, waypoint.searchPrediction.location) < 100 && marker.name === waypoint.searchPrediction.name;
            }) ?? markers.find((marker) => {
                return getDistance(marker.location, waypoint.searchPrediction.location) < 100;
            });
    
            if(!marker) {
                markers.push({
                    id: uuid.v4() as string,
                    name: waypoint.searchPrediction.name,
                    types: [ type ],
                    location: waypoint.searchPrediction.location
                });
            }
            else
                marker.types.push(type);
        }
        else if(waypoint.type === "PATH") {
            {
                let newType = type;

                if(newType === "Finish")
                    newType = "Intermediate";

                const marker = markers.find((marker) => {
                    return getDistance(marker.location, waypoint.path.route[0]) < 100;
                });
    
                if(!marker) {
                    markers.push({
                        id: uuid.v4() as string,
                        name: "Custom path",
                        types: [ newType ],
                        location: waypoint.path.route[0]
                    });
                }
                else
                    marker.types.push(newType);
            }
            
            {
                let newType = type;

                if(newType === "Start") {
                    if(index === waypoints.length - 1)
                        newType = "Finish";
                    else
                        newType = "Intermediate";
                }

                const marker = markers.find((marker) => {
                    return getDistance(marker.location, waypoint.path.route[waypoint.path.route.length - 1]) < 100;
                });
    
                if(!marker) {
                    markers.push({
                        id: uuid.v4() as string,
                        name: "Custom path",
                        types: [ newType ],
                        location: waypoint.path.route[waypoint.path.route.length - 1]
                    });
                }
                else
                    marker.types.push(newType);
            }
        }
    });

    return markers;
};

export default function MapRouteMarkers({ waypoints }: MapRouteMarkersProps) {
    const [ markers, setMarkers ] = useState<MapRouteMarker[]>(getMarkersFromWaypoints(waypoints));

    useEffect(() => {
        setMarkers(getMarkersFromWaypoints(waypoints));
    }, [ waypoints ]);

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
