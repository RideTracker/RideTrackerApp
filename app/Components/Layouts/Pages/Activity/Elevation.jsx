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
        canvas.height = 140 * pixelRatio;

        const width = Dimensions.get("window").width;
        const height = 140;
        
        const context = await canvas.getContext("2d");
        
        const distanceHeight = 40;

        const altitudeWidth = 40;
        const altitudeHeight = height - distanceHeight;

        const graphWidth = width - altitudeWidth;
        const graphHeight = height - distanceHeight;

        this.coordinates = this.state.recording.getAllCoordinates();

        this.points = this.coordinates.length;
        this.widthPerPoint = graphWidth / (this.points - 1);

        this.minAltitude = Math.min(...this.coordinates.map(coordinate => coordinate.altitude));
        this.maxAltitude = Math.max(...this.coordinates.map(coordinate => coordinate.altitude));

        this.altitudeDifference = this.maxAltitude - this.minAltitude;
        this.heightPerAltitude = graphHeight / this.altitudeDifference;

        await this.drawAltitude(canvasWebView, context, pixelRatio, 0, 0, altitudeWidth, altitudeHeight);

        await this.drawDistance(canvasWebView, context, pixelRatio, altitudeWidth, graphHeight, graphWidth, distanceHeight);
        
        await this.drawGraph(canvasWebView, context, pixelRatio, altitudeWidth, 0, graphWidth, graphHeight);
    };

    async drawDistance(canvasWebView, context, pixelRatio, left, top, width, height) {
        context.startBundle();

        const indexes = width / 50;

        const distance = this.state.recording.getDistance();

        const widthPerIndex = width / indexes;
        const distancePerIndex = distance / indexes;

        for(let index = 0; index < indexes; index++) {
            context.save();

            context.font = `${12 * pixelRatio}px sans-serif`;
            context.textAlign = "center";
            context.textBaseline = "middle";
    
            context.fillStyle = Appearance.theme.colorPalette.route;

            context.translate((left + (index * widthPerIndex)) * pixelRatio, (top + (height / 2)) * pixelRatio);
            context.rotate(-45 * Math.PI / 180);

            context.fillText(`${Math.round(index * distancePerIndex)} km`, 0, 0);

            context.restore();
        }

        await context.executeBundle();
    };

    async drawAltitude(canvasWebView, context, pixelRatio, left, top, width, height) {
        context.startBundle();

        const count = 5;

        const rowHeight = height / count;
        const altitudeHeight = this.altitudeDifference / count;


        for(let index = 0; index < count; index++) {
            context.save();

            context.font = `${12 * pixelRatio}px sans-serif`;
            context.textAlign = "center";
            context.textBaseline = "end";
    
            context.fillStyle = Appearance.theme.colorPalette.route;

            context.translate(((width / 2) + left) * pixelRatio, (top + height - (index * rowHeight) - 5) * pixelRatio);
            context.rotate(-45 * Math.PI / 180);

            context.fillText(`${Math.round(index * altitudeHeight)} m`, 0, 0);

            context.restore();
        }

        await context.executeBundle();
    };

    async drawGraph(canvasWebView, context, pixelRatio, left, top, width, height) {
        context.save();

        const path = await canvasWebView.createPath2D();
        
        path.startBundle();
        path.moveTo(left * pixelRatio, (top + height) * pixelRatio);
        for(let point = 0; point < this.points; point++) {
            const altitude = this.coordinates[point].altitude - this.minAltitude;

            path.lineTo((left + Math.floor(point * this.widthPerPoint)) * pixelRatio, (top + Math.floor(height - (altitude * this.heightPerAltitude))) * pixelRatio);
        }
        path.lineTo((left + width) * pixelRatio, (top + height) * pixelRatio);
        await path.executeBundle();
        
        context.lineWidth = pixelRatio;
        context.strokeStyle = Appearance.theme.colorPalette.route;
        context.stroke(path);
        
        path.lineTo((left + width) * pixelRatio, (top + height) * pixelRatio);
        path.lineTo((left * pixelRatio), (top + height) * pixelRatio);
        
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = Appearance.theme.colorPalette.accent;
        context.fill(path);

        context.restore();
    };

    render() {
        return (
            <CanvasWebView
                height={140}
                onLoad={(...args) => this.onLoad(...args)}
                />
        );
    };
};
