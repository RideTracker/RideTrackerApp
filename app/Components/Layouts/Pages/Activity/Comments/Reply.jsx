import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import moment from "moment";

import API from "app/Services/API";

import Cache from "app/Data/Cache";

import { Form } from "app/Components";

import style from "./Reply.style";
import User from "../../../../../Data/User";

export default class ActivityCommentReply extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.input = React.createRef();
    };

    componentDidMount() {
        if(this.props?.parent) {
            Cache.getActivityComment(this.props.parent).then((comment) => {
                this.setState({ comment });
            });
        }

        this.input.current?.focus();
    };

    async onPress() {
        const processing = this.props.showModal("Processing");
        
        const result = await API.post("/api/v1/activity/comment", {
            activity: this.props.activity,
            parent: this.props?.parent || null,
            text: this.input.current.getValue()
        });

        this.props?.onClose(result.success, result.content);

        this.props.hideModal(processing);
    };

    render() {
        return (
            <KeyboardAvoidingView style={style.sheet} behavior={(Platform.OS == "ios")?("padding"):("height")}>
                <TouchableOpacity style={style.sheet.close} onPress={() => this.props?.onClose()}/>

                <View style={style.sheet.container}>
                    <Text style={style.sheet.header}>{(!this.props?.parent)?("Add a comment"):("Reply to comment")}</Text>

                    {this.state?.comment && (
                        <View style={style.sheet.comment}>
                            <Image
                                style={style.sheet.comment.image}
                                source={{
                                    uri: User.data?.avatar
                                }}
                            />

                            <View style={style.sheet.comment.content}>
                                <View style={style.sheet.comment.content.title}>
                                    <Text style={style.sheet.comment.content.author}>{this.state.comment.user.name}</Text>

                                    <Text style={style.sheet.comment.content.time}>{moment(this.state.comment.timestamp).fromNow()}</Text>
                                </View>

                                <Text style={style.sheet.comment.content.description}>{this.state.comment.text}</Text>
                            </View>
                        </View>
                    )}

                    <Text style={style.sheet.advisory}>Your comment will be visible to everyone, remember to be kind to everyone!</Text>

                    <View style={style.sheet.write} onClick={() => this.setState({ showWriteComment: true })}>
                        <View style={style.sheet.write.content}>
                            <Form.Input ref={this.input} style={style.sheet.write.content.input} placeholder="Write your message..." onChangeText={(text) => this.setState({ showSubmit: (text.length != 0) })}/>
                        </View>

                        <TouchableOpacity style={style.sheet.write.submit} onPress={() => this.onPress()}>
                            <FontAwesome5 style={[ style.sheet.write.submit.icon, (this.state?.showSubmit && style.sheet.write.submit.icon.show) ]} name="paper-plane"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    };
};
