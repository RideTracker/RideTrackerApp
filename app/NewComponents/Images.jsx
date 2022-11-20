import React, { Component } from "react";
import { PanResponder, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Appearance from "app/Data/Appearance";

export default class Images extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            left: 0,
            index: 0
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      
            onPanResponderGrant: (evt, gestureState) => {

            },
            onPanResponderMove: (evt, gestureState) => {
                if(gestureState.dx < 0 && this.state.index == this.props.children.length - 1)
                    return;
                else if(gestureState.dx > 0 && this.state.index == 0)
                    return;

                this.setState({
                    left: gestureState.dx
                });
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                let index = this.state.index;

                if(this.state.left == 0) {
                    if(this.props.children[index].props?.onPress)
                        this.props.children[index].props.onPress();

                    return;
                }

                if(index != 0 && gestureState.dx > 30)
                    index--;
                else if(index != this.props.children.length - 1 && gestureState.dx < -30)
                    index++;

                this.setState({
                    left: 0,
                    index
                });
            },
            onPanResponderTerminate: (evt, gestureState) => {
                this.setState({
                    left: 0
                });
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            },
        });
    };

    onPress(direction) {
        if(direction > 0 && this.state.index + direction < this.props.children.length)
            return this.setState({ index: this.state.index + direction });

        if(direction < 0 && this.state.index + direction >= 0)
            return this.setState({ index: this.state.index + direction });
    };

    render() {
        return (
            <View
                height={this.props?.height}
                >
                <View
                    style={{
                        position: "relative",

                        width: "100%",
                        height: "100%",
                        
                        left: this.state.left
                    }}
                    {...this.panResponder.panHandlers}
                    >
                    <View
                        style={{
                            position: "relative",

                            width: "100%",
                            height: "100%",
                            
                            left: `-${this.state.index * 100}%`
                        }}
                        >
                        {this.props.children.map((child, index) => (
                            <View
                                key={index}
                                style={{
                                    position: "absolute",

                                    width: "100%",
                                    height: "100%",

                                    left: `${index * 100}%`,
                                    top: 0
                                }}
                            >
                                {child}
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => this.onPress(-1)}
                    style={{
                        position: "absolute",
                        top: 0,
        
                        height: "100%",
        
                        justifyContent: "center",
        
                        padding: 12,
                        
                        left: 0
                    }}
                    >
                    <FontAwesome5
                        name="chevron-left"
                        solid

                        style={{
                            color: Appearance.theme.colorPalette.secondary,
                            fontSize: 24,
                        }}
                        />
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={() => this.onPress(+1)}
                    style={{
                        position: "absolute",
                        top: 0,
        
                        height: "100%",
        
                        justifyContent: "center",
        
                        padding: 12,
                        
                        right: 0
                    }}
                    >
                    <FontAwesome5
                        name="chevron-right"
                        solid

                        style={{
                            color: Appearance.theme.colorPalette.secondary,
                            fontSize: 24,
                        }}
                        />
                </TouchableOpacity>

                <View style={{
                    position: "absolute",

                    width: "100%",
                    
                    padding: 12,
    
                    left: 0,
                    bottom: 0,
    
                    justifyContent: "center",
                    flexDirection: "row"
                }}>
                    {this.props.children.map((child, index) => (
                        <FontAwesome5 
                            key={index}
                            
                            name="circle"
                            solid={this.state.index == index}

                            style={{
                                color: Appearance.theme.colorPalette.secondary,

                                fontSize: 12,

                                opacity: (this.state.index == index)?(1):(.75),

                                marginRight: 6,
                                marginLeft: 6
                            }}
                            />
                    ))}
                </View>
            </View>
        );
    };
};
