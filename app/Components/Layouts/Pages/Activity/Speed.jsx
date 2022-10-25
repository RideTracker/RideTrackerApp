import React, { Component } from "react";
import { Dimensions, PixelRatio, View } from "react-native";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

import Graph from "app/Components/Graph.component";

export default class ActivitySpeed extends Component {
    componentDidMount() {
        Cache.getActivityRide(this.props.activity).then((ride) => {
            this.setState({ recording: new Recording(ride) });
        });
    };

    render() {
        if(!this.state?.recording)
            return (null);

        // implement a better and "less logical" solution
            
        const coordinates = this.state.recording.getAllCoordinates();

        const minSpeed = Math.min(...coordinates.map(coordinate => coordinate.speed));
        const maxSpeed = Math.max(...coordinates.map(coordinate => coordinate.speed));
        
        const speedDifference = maxSpeed - minSpeed;

        return (
            <Graph
                onReady={() => this.props?.onReady && this.props.onReady()}
                maxLeftAmount={speedDifference}
                maxBottomAmount={this.state.recording.getDistance()}
                leftUnit={"km/h"}
                bottomUnit={"km"}
                bottomPoints={coordinates.length}
                points={
                    coordinates.map((coordinate) => {
                        return coordinate.speed - minSpeed
                    })
                }
                />
        );
    };
};
