import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import moment from "moment";

import API from "app/API";

import Cache from "app/Data/Cache";

import Input from "app/Components/Input.component";

import style from "./Reply.style";

export default class ActivityCommentReply extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.input = React.createRef();
    };

    async onPress() {
        const result = await API.post("/api/activity/comment", {
            activity: this.props.activity,
            text: this.input.current.getValue()
        });

        this.props?.onClose(result.success, result.content);
    };

    render() {
        return (
            <View style={style.sheet}>
                <TouchableOpacity style={style.sheet.close} onPress={() => this.props?.onClose()}/>

                <View style={style.sheet.container}>
                    <Text style={style.sheet.header}>{(this.props.type == "activity")?("Add a comment"):("Reply to comment")}</Text>

                    <Text style={style.sheet.advisory}>Your comment will be visible to everyone, remember to be kind to everyone!</Text>

                    <View style={style.sheet.write} onClick={() => this.setState({ showWriteComment: true })}>
                        <View style={style.sheet.write.content}>
                            <Input ref={this.input} style={style.sheet.write.content.input} placeholder="Write your message..." onChangeText={(text) => this.setState({ showSubmit: (text.length != 0) })}/>
                        </View>

                        <TouchableOpacity style={style.sheet.write.submit} onPress={() => this.onPress()}>
                            <FontAwesome5 style={[ style.sheet.write.submit.icon, (this.state?.showSubmit && style.sheet.write.submit.icon.show) ]} name="paper-plane"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
};
