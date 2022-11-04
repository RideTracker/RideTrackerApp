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

                    <View style={style.sheet.grid.stretch}>
                        {this.state?.bike && this.state.bike?.name && (
                            <Text style={style.sheet.text}>{this.state.bike.name}</Text>
                        )}
                        
                        {this.state?.bike && (this.state.bike?.brand || this.state.bike?.model || this.state.bike?.year) && (
                            <Text style={style.sheet.text}>{([ this.state.bike?.brand, this.state.bike?.model, this.state.bike?.year ]).filter(x => x != null).join(' ')}</Text>
                        )}

                        <View style={style.sheet.stats}>
                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>4</Text>
                                <Text style={style.sheet.stats.item.description}>rides</Text>
                            </View>
                            
                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>72 km</Text>
                                <Text style={style.sheet.stats.item.description}>distance</Text>
                            </View>
                            
                            <View style={style.sheet.stats.item}>
                                <Text style={style.sheet.stats.item.title}>262 m</Text>
                                <Text style={style.sheet.stats.item.description}>elevation</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
};
