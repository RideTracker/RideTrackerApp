import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";

import Animation from "app/Animation";

import Appearance from "app/Data/Appearance";

export class Page extends Component {
    constructor(...args) {
        super(...args);

        this.animation = React.createRef();
    };

    onClose() {
        if(!this.animation.current)
            return this.props.onClose();

        this.animation.current.setTransitions([
            {
                type: "left",
                direction: "out",
                duration: 200,
                callback: () => this.props.onClose()
            },

            {
                type: "opacity",
                direction: "out",
                duration: 200
            }
        ]);
    };

    render() {
        return (
            <Animation
                ref={this.animation}
                enabled={(this.props?.visible != undefined)?(this.props.visible):(true)}
                style={{
                    position: "absolute",
    
                    left: 0,
                    top: 0,
    
                    width: "100%",
                    height: "100%"
                }}
                transitions={[
                    {
                        type: "left",
                        duration: 200
                    },
                    
                    {
                        type: "opacity",
                        duration: 200
                    }
                ]}
                >
                    
                <View style={{
                    position: "absolute",
    
                    left: 0,
                    top: 0,
    
                    width: "100%",
                    height: "100%",
                    
                    backgroundColor: Appearance.theme.colorPalette.background
                }}>
                    {this.props.children}
                </View>
            </Animation>
        );
    };
};

export class SubPage extends Page {
    constructor(...args) {
        super(...args);

        this.animation = React.createRef();
    };

    onClose() {
        if(!this.animation.current)
            return this.props.onClose();

        this.animation.current.setTransitions([
            {
                type: "bottom",
                direction: "out",
                duration: 200,
                callback: () => this.props.onClose()
            },

            {
                type: "opacity",
                direction: "out",
                duration: 200
            }
        ]);
    };

    render() {
        return (
            <Animation
                ref={this.animation}
                enabled={true}
                style={{
                    position: "absolute",
    
                    left: 0,
                    top: 0,
    
                    width: "100%",
                    height: "100%",
    
                    flex: 1
                }}
                transitions={[
                    {
                        type: "bottom",
                        duration: 200
                    },
                    
                    {
                        type: "opacity",
                        duration: 200
                    }
                ]}
                >
                <TouchableOpacity 
                    onPress={() => this.onClose()}

                    style={{
                        height: "100%",
                        width: "100%",
            
                        position: "absolute",
            
                        left: 0,
                        top: 0,

                        backgroundColor: "rgba(0, 0, 0, .5)"
                    }}
                    />
                    
                <View style={{
                    marginTop: "auto",

                    maxHeight: "80%",

                    backgroundColor: Appearance.theme.colorPalette.background,

                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,

                    paddingVertical: 6,
                    paddingHorizontal: 12
                }}>
                    {this.props.children}
                </View>
            </Animation>
        );
    };
};
