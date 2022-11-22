import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Appearance from "app/Data/Appearance";

import Pages from "app/Data/Config/Pages.json";

export default class Footer extends Component {
    render() {
        return (
            <View style={{
                height: 70,
                width: "100%",

                backgroundColor: Appearance.theme.colorPalette.common,
                
                borderTopWidth: 1,
                borderTopColor: Appearance.theme.colorPalette.border,

                position: "relative"
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: "row"
                }}>
                    {Pages.map((page) => (
                        <TouchableOpacity key={page.path} style={{
                            height: 60,

                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }} onPress={() => this.props.onNavigate(page.path)}>
                            <FontAwesome5 style={{
                                color: Appearance.theme.colorPalette.secondary,
            
                                fontSize: 20
                            }} name={page.icon}/>

                            <Text style={{
                                color: Appearance.theme.colorPalette.secondary,

                                marginTop: 4,
                    
                                fontSize: 14,
                    
                                textAlign: "center"
                            }}>{page.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {this.state?.systemeThemeChanged && (
                    <View style={{
                        position: "absolute",
                        bottom: "100%",

                        width: "100%",
                        
                        backgroundColor: Appearance.theme.colorPalette.border,

                        padding: 12
                    }}>
                        <Text style={{
                            color: Appearance.theme.colorPalette.secondary
                        }}>
                            We've turned on {Appearance.theme.id} mode for you to match your device's appearance mode!
                        </Text>
                    </View>
                )}
            </View>
        );
    }
};
