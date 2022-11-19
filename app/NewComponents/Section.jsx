import { Component } from "react";
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import Appearance from "app/Data/Appearance";

export default class Section extends Component {
    render() {
        const style = {
            position: "relative",
            
            marginTop: 6,
            marginBottom: 6,

            backgroundColor: Appearance.theme.colorPalette.primary,
            
            borderBottomWidth: 1,
            borderBottomColor: Appearance.theme.colorPalette.border,
            
            borderTopWidth: 1,
            borderTopColor: Appearance.theme.colorPalette.border,

            ...this.props?.style
        };
        
        if(this.props?.onPress) {
            if(this.props?.allergicToOpacity) {
                return (
                    <View style={style}>
                        {this.props.children}
        
                        {(this.props.onPress) && (
                            <TouchableWithoutFeedback
                                onPress={() => this.props.onPress()}
                                onPressIn={() => this.setState({ pressing: true })}
                                onPressOut={() => this.setState({ pressing: false })}
                                >
                                <View style={{
                                    position: "absolute",
        
                                    left: 0,
                                    top: 0,
        
                                    width: "100%",
                                    height: "100%",
        
                                    backgroundColor: (this.state?.pressing)?("rgba(0, 0, 0, .25)"):("transparent")
                                }}/>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                );
            }

            return (
                <TouchableOpacity style={style} onPress={() => this.props.onPress()}>
                    {this.props.children}
                </TouchableOpacity>
            );
        }

        return (
            <View style={style}>
                {this.props.children}
            </View>
        );
    };
};
