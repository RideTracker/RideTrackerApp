import React, { Component } from "react";
import { Dimensions, PixelRatio, View } from "react-native";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

import Graph from "app/Components/Graph.component";

export default class ActivityElevation extends Component {
    componentDidMount() {
        Cache.getActivityRide(this.props.activity).then((ride) => {
            this.setState({ recording: new Recording(ride) });
        });
    };

    render() {
        if(!this.state?.recording)
            return (null);
            
        const coordinates = this.state.recording.getAllCoordinates();

        const minAltitude = Math.min(...coordinates.map(coordinate => coordinate.altitude));
        const maxAltitude = Math.max(...coordinates.map(coordinate => coordinate.altitude));
        
        const altitudeDifference = maxAltitude - minAltitude;

        return (
            <Graph
                onReady={() => this.props?.onReady && this.props.onReady()}
                maxLeftAmount={altitudeDifference}
                maxBottomAmount={this.state.recording.getDistance()}
                leftUnit={"m"}
                bottomUnit={"km"}
                bottomPoints={coordinates.length}
                points={
                    coordinates.map((coordinate) => {
                        return coordinate.altitude - minAltitude
                    })
                }
                />
        );
    };
};
