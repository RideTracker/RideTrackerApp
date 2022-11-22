import React, { Component } from "react";
import { View, TextInput } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Appearance from "app/Data/Appearance";

export default class Input extends Component {
    constructor(...args) {
        super(...args);

        this.input = React.createRef();
    }

    getValue() {
        return this.state?.value;
    };

    focus(...args) {
        return this.input.current?.focus(...args);
    };

    onChangeText(text) {
        this.setState({ value: text });

        if(this.props?.onChangeText)
            this.props.onChangeText(text);
    };

    render() {
        return (
            <View style={{
                flexDirection: "row",

                backgroundColor: Appearance.theme.colorPalette.primary,

                width: "100%",
                height: 44,

                borderRadius: 6,
    
                borderColor: Appearance.theme.colorPalette.border,
                borderWidth: 1,

                ...this.props?.style
            }}>
                {this.props?.icon && (
                    <View style={{
                        justifyContent: "center",
                        height: 44,
                        width: 44
                    }}>
                        <FontAwesome5
                            name={this.props?.icon}
                            solid={this.props?.solid ?? true}
                            style={{
                                textAlign: "center",

                                fontSize: 18,
                
                                color: Appearance.theme.colorPalette.secondary
                            }}/>
                    </View>
                )}

                <TextInput
                    ref={this.input}
                    onChangeText={(text) => this.onChangeText(text)}
                    style={{
                        width: "100%",
                        fontSize: 18,

                        color: Appearance.theme.colorPalette.secondary,
                        
                        height: 44,
                        
                        paddingLeft: (!this.props?.icon)?(12):(0)
                    }}
                    placeholder={this.props?.placeholder}
                    placeholderTextColor={Appearance.theme.colorPalette.secondary}
                    secureTextEntry={this.props?.secure}
                    autoComplete={this.props?.autoComplete}
                    autoCorrect={this.props?.autoCorrect}
                    clearTextOnFocus={this.props?.clearTextOnFocus}
                    clearButtonMode={this.props?.clearButtonMode}
                    enablesReturnKeyAutomatically={this.props?.enablesReturnKeyAutomatically}
                    keyboardType={this.props?.keyboardType}
                    autoCapitalize={this.props?.autoCapitalize}
                    returnKeyType={this.props?.returnKeyType}
                    onSubmitEditing={this.props?.onSubmitEditing}
                    multiline={this.props?.multiline}
                    />
            </View>
        );
    };
};
