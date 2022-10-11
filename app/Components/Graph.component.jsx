import React, { Component } from "react";
import { PixelRatio, Dimensions } from "react-native";

import CanvasWebView, { Path2D } from "react-native-webview-canvas";

import Appearance from "app/Data/Appearance";

export default class Graph extends Component {
    async onLoad(canvasWebView) {
        this.pixelRatio = PixelRatio.get();

        this.canvasWebView = canvasWebView;

		const canvas = await this.canvasWebView.createCanvas();

        const width = this.props.width ?? Dimensions.get("window").width;
        const height = this.props.height ?? 140;

        canvas.width = width * this.pixelRatio;
        canvas.height = height * this.pixelRatio;
        
        this.context = await canvas.getContext("2d");
        
        const bottomHeight = 40;

        const leftWidth = 40;
        const leftHeight = height - bottomHeight;

        const graphWidth = width - leftWidth;
        const graphHeight = height - bottomHeight;

        this.context.startBundle();

        await this.drawAltitude(0, 0, leftWidth, leftHeight);

        await this.drawDistance(leftWidth, graphHeight, graphWidth, bottomHeight);

        await this.drawGraph(leftWidth, 0, graphWidth, graphHeight);
        
        await this.context.executeBundle();
    };

    async drawDistance(left, top, width, height) {
        const indexes = width / 50;

        const widthPerIndex = width / indexes;
        const distancePerIndex = this.props.maxBottomAmount / indexes;

        for(let index = 0; index <= indexes; index++) {
            this.context.save();

            this.context.font = `${12 * this.pixelRatio}px sans-serif`;
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
    
            this.context.fillStyle = Appearance.theme.colorPalette.route;

            this.context.translate((left + (index * widthPerIndex)) * this.pixelRatio, (top + (height / 2)) * this.pixelRatio);
            this.context.rotate(-45 * Math.PI / 180);

            this.context.fillText(`${Math.round(index * distancePerIndex)} ${this.props.bottomUnit}`, 0, 0);

            this.context.restore();
        }
    };

    async drawAltitude(left, top, width, height) {
        const count = 5;

        const rowHeight = height / count;
        const leftHeight = this.props.maxLeftAmount / count;

        for(let index = 0; index < count; index++) {
            this.context.save();

            this.context.font = `${12 * this.pixelRatio}px sans-serif`;
            this.context.textAlign = "center";
            this.context.textBaseline = "end";
    
            this.context.fillStyle = Appearance.theme.colorPalette.route;

            this.context.translate(((width / 2) + left) * this.pixelRatio, (top + height - (index * rowHeight) - 5) * this.pixelRatio);
            this.context.rotate(-45 * Math.PI / 180);

            this.context.fillText(`${Math.round(index * leftHeight)} ${this.props.leftUnit}`, 0, 0);

            this.context.restore();
        }
    };

    async drawGraph(left, top, width, height) {
        this.context.save();

        const path = await this.canvasWebView.createPath2D();

        const heightPerLeft = height / this.props.maxLeftAmount;
        const widthPerBottom = width / (this.props.bottomPoints - 1);
        
        path.startBundle();
        path.moveTo(left * this.pixelRatio, (top + height) * this.pixelRatio);
        for(let point = 0; point < this.props.bottomPoints; point++) {
            path.lineTo((left + Math.floor(point * widthPerBottom)) * this.pixelRatio, (top + Math.floor(height - (this.props.points[point] * heightPerLeft))) * this.pixelRatio);
        }
        path.lineTo((left + width) * this.pixelRatio, (top + height) * this.pixelRatio);
        await path.executeBundle();
        
        this.context.lineWidth = this.pixelRatio;
        this.context.strokeStyle = Appearance.theme.colorPalette.route;
        this.context.stroke(path);

        path.lineTo((left + width) * this.pixelRatio, (top + height) * this.pixelRatio);
        
        this.context.globalCompositeOperation = "destination-over";
        this.context.fillStyle = Appearance.theme.colorPalette.accent;
        this.context.fill(path);

        this.context.restore();
    };

    render() {
        return (
            <CanvasWebView
                height={this.props.height ?? 140}
                onLoad={(...args) => this.onLoad(...args)}
                />
        )
    };
};
