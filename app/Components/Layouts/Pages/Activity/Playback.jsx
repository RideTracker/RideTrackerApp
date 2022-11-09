import React, { Component } from "react";
import { View, Text, PixelRatio, Dimensions } from "react-native";
import WebView from "react-native-webview";
import CanvasWebView from "react-native-webview-canvas";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";
import Recording from "app/Data/Recording";

import Settings from "app/Settings";

import Animation from "app/Components/Animation.component";

import Header from "app/Components/Layouts/Header.component";

import style from "./Playback.style";

export default class ActivityPlayback extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);
        
        this.animation = React.createRef();
        this.webView = React.createRef();
        this.canvasWebView = React.createRef();
    };

    componentDidMount() {
        Cache.getActivityRide(this.props.activity).then((ride) => {
            this.setState({
                recording: new Recording(ride),
                ready: true
            });
        });
    };

    onClose() {
        this.animation.current.setTransitions([
            {
                type: "bottom",
                direction: "out",
                duration: 200,
                callback: () => this.props?.onClose()
            },
            
            {
                type: "opacity",
                direction: "out",
                duration: 200
            }
        ]);
    };

    onLoad() {
        this.animation.current.setTransitions([
            {
                type: "bottom",
                duration: 200
            },
            
            {
                type: "opacity",
                duration: 200
            }
        ]);
    };

    postEvent(event) {
        this.webView.current.injectJavaScript(`window.playback.${event}().then(() => window.ReactNativeWebView.postMessage(JSON.stringify({ event: "${event}" })))`);
    };

    onMessage(event) {
        if(!this.webView?.current)
            return;

        const content = JSON.parse(event.nativeEvent.data);

        switch(content.event) {
            case "ready": {
                this.postEvent("fitMapToBoundsAsync");

                break;
            }

            case "fitMapToBoundsAsync": {
                setTimeout(() => this.postEvent("focusMapToStartAsync"), 2000);

                break;
            }

            case "focusMapToStartAsync": {
                setTimeout(() => this.postEvent((this.props.type == "3d")?("zoomMapToStartAsync"):("playback")), 1000);

                break;
            }

            case "zoomMapToStartAsync": {
                setTimeout(() => this.postEvent("playback"), 2000);

                break;
            }

            case "playback": {
                this.onClose();

                break;
            }

            case "frame": {
                this.setState({ frame: content });

                break;
            }
        }
    };

    async onCanvasLoad() {
        this.pixelRatio = PixelRatio.get();

        this.canvas = await this.canvasWebView.current.createCanvas();
        this.path = await this.canvasWebView.current.createPath2D();

        this.width = Dimensions.get("window").width;
        this.height = 120;

        this.canvas.height = 120 * this.pixelRatio;
        this.canvas.width = this.width * this.pixelRatio;

        this.points = 0;
        this.sectionPoints = [];

        this.maxAltitude = null;
        this.minAltitude = null;

        this.state.recording.data.sections.forEach((section) => {
            this.points += section.coordinates.length;

            this.sectionPoints.push(section.coordinates.length);

            section.coordinates.forEach((coordinate) => {
                if(coordinate.coords.altitude < this.minAltitude || this.minAltitude == null)
                    this.minAltitude = coordinate.coords.altitude;

                if(coordinate.coords.altitude > this.maxAltitude || this.maxAltitude == null)
                    this.maxAltitude = coordinate.coords.altitude;
            });
        });

        this.altitudeRange = this.maxAltitude - this.minAltitude;

        this.heightPerAltitude = this.height / this.altitudeRange;

        this.widthPerPoint = this.width / this.points;
        
        this.canvasWebView.current.requestAnimationFrame(() => this.onCanvasRender());
    };

    async onCanvasRender() {
        if(!this.canvasWebView.current)
            return this.canvasWebView.current.requestAnimationFrame(() => this.onCanvasRender());

        if(!this.state.frame)
            return this.canvasWebView.current.requestAnimationFrame(() => this.onCanvasRender());

        const context = await this.canvas.getContext("2d");

        context.clearRect(0, 0, this.width, this.height);

        let point = 0;

        for(let index = 0; index <= this.state.frame.section; index++) {
            if(index == this.state.frame.section) {
                point += this.state.frame.coordinate;

                break;
            }

            point += this.sectionPoints[index];
        }
        
        context.startBundle();

        const altitude = this.state.recording.data.sections[this.state.frame.section].coordinates[this.state.frame.coordinate].coords.altitude - this.minAltitude;

        const left = point * this.widthPerPoint * this.pixelRatio;
        const top = (this.height - (altitude * this.heightPerAltitude)) * this.pixelRatio;

        this.path.lineTo(left, top);

        /*context.beginPath();
        context.moveTo(0, this.height);

        let point = 0;

        this.state.recording.data.sections.forEach((section) => {
            section.coordinates.forEach((coordinate) => {
                point++;

                const altitude = coordinate.coords.altitude - this.minAltitude;

                const left = point * this.widthPerPoint * this.pixelRatio;
                const top = (this.height - (altitude * this.heightPerAltitude)) * this.pixelRatio;

                context.lineTo(left, top);
            });
        });*/
        
        context.globalAlpha = 1;
        context.lineWidth = this.pixelRatio;
        context.strokeStyle = Appearance.theme.colorPalette.route;
        context.stroke(this.path);

        context.executeBundle();
        
        return this.canvasWebView.current.requestAnimationFrame(() => this.onCanvasRender());
    };

    render() {
        if(this.state?.recording == null)
            return null;

        return (
            <Animation
                ref={this.animation}
                enabled={this.state?.ready}
                style={style.sheet}
                >
                <WebView
                    ref={this.webView}
                    style={style.sheet.map}
                    onLoad={() => this.onLoad()}
                    onMessage={(event) => this.onMessage(event)}
                    source={{
                        uri: `${Settings.api}/playback/index.html?activity=${this.props.activity}&color=${Appearance.theme.colorPalette.route.replace('#', '')}&type=${this.props.type}`
                    }}
                    />

                <Header
                    title="Playback"
                    transparent={true}
                    navigation="true"
                    onNavigationPress={() => this.onClose()}
                    style={style.sheet.header}
                    />

                {this.state?.frame && (
                    <View style={style.sheet.overlay}>
                        <View style={style.sheet.overlay.stats}>
                            <View style={style.sheet.overlay.stats.item}>
                                <Text style={style.sheet.overlay.stats.item.title}>{this.state.recording.getSectionCoordinateSpeed(this.state.frame.section, this.state.frame.coordinate)}
                                    <Text style={style.sheet.overlay.stats.item.unit}> km/h</Text>
                                </Text>
                                <Text style={style.sheet.overlay.stats.item.description}>speed</Text>
                            </View>
                            
                            <View style={style.sheet.overlay.stats.item}>
                                <Text style={style.sheet.overlay.stats.item.title}>{this.state.recording.getSectionCoordinateDistance(this.state.frame.section, this.state.frame.coordinate)}
                                    <Text style={style.sheet.overlay.stats.item.unit}> km</Text>
                                </Text>
                                <Text style={style.sheet.overlay.stats.item.description}>distance</Text>
                            </View>
                            
                            <View style={style.sheet.overlay.stats.item}>
                                <Text style={style.sheet.overlay.stats.item.title}>{this.state.recording.getSectionCoordinateElevation(this.state.frame.section, this.state.frame.coordinate)}
                                    <Text style={style.sheet.overlay.stats.item.unit}> m</Text>
                                </Text>
                                <Text style={style.sheet.overlay.stats.item.description}>elevation</Text>
                            </View>
                        </View>

                        <CanvasWebView
                            ref={this.canvasWebView}
                            height={120}
                            width={Dimensions.get("window").width}
                            style={style.sheet.graph}
                            onLoad={(canvasWebView) => this.onCanvasLoad(canvasWebView)}
                            />
                    </View>
                )}

            </Animation>
        );
    };
};
