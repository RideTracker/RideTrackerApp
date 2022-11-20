import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Constants from "expo-constants";

import Appearance from "app/Data/Appearance";

import ThemedComponent from "app/Components/ThemedComponent";

export default class Header extends ThemedComponent {
    render() { 
        return (
            <View style={{
                width: "100%",

                position: "relative",
                borderBottomWidth: 1,

                backgroundColor: (this.props?.transparent)?("transparent"):(Appearance.theme.colorPalette.common),
                borderBottomColor: (this.props?.transparent)?("transparent"):(Appearance.theme.colorPalette.border),

                ...this.props?.style,

                paddingTop: (!this.props?.hidePadding)?(Constants.statusBarHeight):(0),
            }}>
                { this.props?.title && (
                    <Text style={{
                        color: Appearance.theme.colorPalette.secondary,

                        fontWeight: "bold",
                        fontSize: 26,

                        padding: 12,

                        textAlign: "center"
                    }}>
                        {this.props.title}
                    </Text>
                )}

                <View style={{
                    flexDirection: "row",
                    
                    marginLeft: 24,
    
                    position: "absolute",
    
                    top: Constants.statusBarHeight + 16,
                    right: 0
                }}>
                    {this.props?.button && (
                        <TouchableOpacity
                            style={{
                                justifyContent: "center",
                    
                                marginRight: 24
                            }}
                            onPress={this.props.onButtonPress}
                            >
                            <FontAwesome5
                                name={this.props.button}
                                style={{
                                    color: Appearance.theme.colorPalette.secondary,
                    
                                    fontSize: 26
                                }}
                                />
                        </TouchableOpacity>
                    )}

                    {this.props?.navigation && (
                        <TouchableOpacity
                            style={{
                                justifyContent: "center",
                    
                                marginRight: 24
                            }}
                            onPress={this.props.onNavigationPress}
                            >
                            <FontAwesome5
                                name={"times"}
                                style={{
                                    color: Appearance.theme.colorPalette.secondary,
                    
                                    fontSize: 26
                                }}
                                />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
};
