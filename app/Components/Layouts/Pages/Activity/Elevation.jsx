import React, { Component } from "react";

import Canvas, { Path2D } from "react-native-canvas";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

export default class ActivityElevation extends Component {
    componentDidMount() {
        Cache.getActivityRide(this.props.activity).then((ride) => {
            this.setState({ recording: new Recording(ride) });
        });
    };

    canvas(canvas) {
        if(!canvas || !this.state?.recording)
            return;

        const context = canvas.getContext("2d");

        const coordinates = this.state.recording.getAllCoordinates();

        const points = coordinates.length;
        const widthPerPoint = canvas.width / points;

        const minAltitude = Math.min(...coordinates.map(coordinate => coordinate.altitude));
        const maxAltitude = Math.max(...coordinates.map(coordinate => coordinate.altitude));

        const altitudeDifference = maxAltitude - minAltitude;
        const heightPerAltitude = canvas.height / altitudeDifference;

        const path = new Path2D(canvas);

        for(let point = 0; point < points; point++) {
            const altitude = coordinates[point].altitude - minAltitude;

            path.lineTo(point * widthPerPoint, canvas.height - (altitude * heightPerAltitude));
        }

        context.strokeStyle = Appearance.theme.colorPalette.route;
        context.stroke(path);

        path.lineTo(canvas.width, canvas.height);
        path.lineTo(0, canvas.height);

        context.globalCompositeOperation = "destination-over";
        context.fillStyle = Appearance.theme.colorPalette.accent;
        context.fill(path);
    };

    render() {
        return (<Canvas ref={(canvas) => this.canvas(canvas)} height={this.props?.height}/>);
    };
};
