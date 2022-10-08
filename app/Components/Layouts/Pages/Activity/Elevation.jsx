import React, { Component } from "react";
import { Dimensions, PixelRatio, View } from "react-native";

import CanvasWebView, { Path2D } from "react-native-webview-canvas";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

export default class ActivityElevation extends Component {
    componentDidMount() {
        Cache.getActivityRide(this.props.activity).then((ride) => {
            this.setState({ recording: new Recording(ride) });
        });
    };

    async onLoad(canvasWebView) {
        if(!this.state?.recording) 
            return;

		const canvas = await canvasWebView.createCanvas();

        const pixelRatio = PixelRatio.get();

        canvas.width = Dimensions.get("window").width * pixelRatio;
        canvas.height = 120 * pixelRatio;

        const width = Dimensions.get("window").width;
        const height = 120;
        
        const context = await canvas.getContext("2d");
        
        const coordinates = this.state.recording.getAllCoordinates();

        const points = coordinates.length;
        const widthPerPoint = width / (points - 1);

        const minAltitude = Math.min(...coordinates.map(coordinate => coordinate.altitude));
        const maxAltitude = Math.max(...coordinates.map(coordinate => coordinate.altitude));

        const altitudeDifference = maxAltitude - minAltitude;
        const heightPerAltitude = height / altitudeDifference;

        const path = await canvasWebView.createPath2D();
        
        path.startBundle();
        for(let point = 0; point < points; point++) {
            const altitude = coordinates[point].altitude - minAltitude;

            path.lineTo(Math.floor(point * widthPerPoint) * pixelRatio, Math.floor(height - (altitude * heightPerAltitude)) * pixelRatio);
        }
        await path.executeBundle();
        
        context.strokeStyle = Appearance.theme.colorPalette.route;
        context.stroke(path);
        
        path.lineTo(width * pixelRatio, height * pixelRatio);
        path.lineTo(0, height * pixelRatio);
        
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = Appearance.theme.colorPalette.accent;
        context.fill(path);
    };

    render() {
        return (
            <CanvasWebView
                height={120}
                onLoad={(...args) => this.onLoad(...args)}
                />
        );
    };
};
