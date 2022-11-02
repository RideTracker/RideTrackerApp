import React, { Component } from "react";
import { Image, PixelRatio, View, Text, TouchableOpacity } from "react-native";
import CanvasWebView from "react-native-webview-canvas";

import API from "app/Services/API";

import style from "./BikeCompact.style";

export default class BikeCompact extends Component {
    style = style.update();

    componentDidMount() {
        API.get("/api/bike", { bike: this.props.id }).then((data) => {
            this.setState({ bike: data.content });

            console.log(data.content.image);
        });
    };

    render() {
        return (
            <TouchableOpacity style={style.sheet} onPress={() => this.props.onPress(this.props.id)}>
                <View style={style.sheet.grid}>
                    {this.state?.bike && this.state.bike?.image && (
                        <Image
                            style={style.sheet.image}
                            source={{
                                uri: this.state.bike.image
                            }}
                            />
                    )}

                    <View>
                        {this.state?.bike && this.state.bike?.name && (
                            <Text style={style.sheet.text}>{this.state.bike.name}</Text>
                        )}
                        
                        {this.state?.bike && (this.state.bike?.brand || this.state.bike?.model || this.state.bike?.year) && (
                            <Text style={style.sheet.text}>{([ this.state.bike?.brand, this.state.bike?.model, this.state.bike?.year ]).filter(x => x != null).join(' ')}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
};
