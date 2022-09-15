import React, { Component } from "react";
import { Text, View, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import style from "./Footer.component.style";

export default class Footer extends Component {
    render() { 
        return (
            <View style={style}>
                <View style={style.container}>
                    <TouchableOpacity style={style.container.button} onPress={() => this.props.onPress("home")}>
                        <FontAwesome5 style={style.container.button.icon} name={"home"}/>

                        <Text style={style.container.button.text}>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={style.container.button} onPress={() => this.props.onPress("record")}>
                        <FontAwesome5 style={style.container.button.icon} name={"dot-circle"} solid/>

                        <Text style={style.container.button.text}>Record</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={style.container.button} onPress={() => this.props.onPress("profile")}>
                        <FontAwesome5 style={style.container.button.icon} name={"user"} solid/>

                        <Text style={style.container.button.text}>Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};
