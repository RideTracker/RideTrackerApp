import React, { Component } from "react";
import { PanResponder, TouchableHighlight, TouchableOpacity, View } from "react-native";

import style from "./Images.component.style";

export default class Images extends Component {
    style = style.update();

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
                console.log("onPanResponderGrant", gestureState);
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
                console.log("onPanResponderTerminate", gestureState);

                this.setState({
                    left: 0
                });
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            },
        });
    };

    render() {
        return (
            <View
                height={this.props?.height}
                {...this.panResponder.panHandlers}
                >
                <View
                    style={{
                        left: this.state.left,

                        ...style.sheet
                    }}
                >
                    <View
                        style={{
                            left: `-${this.state.index * 100}%`,
                            ...style.sheet.images,
                        }}
                    >
                        {this.props.children.map((child, index) => (
                            <View
                                key={index}
                                style={{
                                    left: `${index * 100}%`,
                                    
                                    ...style.sheet.images.image
                                }}
                            >
                                {child}
                            </View>
                        ))}
                    </View>
                </View>

                <View style={style.sheet.dots}>
                    {this.props.children.map((child, index) => (
                        <View key={index} style={[ style.sheet.dots.dot, this.state.index == index && style.sheet.dots.selected ]}/>
                    ))}
                </View>
            </View>
        );
    };
};
