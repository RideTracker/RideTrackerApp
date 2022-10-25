import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image, RefreshControl } from "react-native";

import moment from "moment";

import Appearance from "app/Data/Appearance";
import Cache from "app/Data/Cache";

import Animation from "app/Components/Animation.component";

import ActivityCommentReply from "./Comments/Reply";

import style from "./Comments.style";

export default class ActivityComments extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);
        
        this.background = React.createRef();
        this.container = React.createRef();
    };

    componentDidMount() {
        Cache.getActivityComments(this.props.activity).then(async (comments) => {
            const collection = [];

            for(let index = 0; index < comments.length; index++) {
                collection[index] = await Cache.getActivityComment(comments[index]);
            }
            
            if(collection.length) {
                this.background.current.setTransitions([
                    {
                        type: "opacity",
                        duration: 200,
                        ease: true
                    }
                ]);

                this.container.current.setTransitions([
                    {
                        type: "bottom",
                        duration: 200,
                        ease: true
                    }
                ]);
            }
            
            this.setState({
                comments: collection,
                showReply: collection.length == 0,
                ready: true
            });
        });
    };

    onClose() {
        this.container.current.setTransitions([
            {
                type: "bottom-out",
                duration: 200,
                callback: () => this.props?.onClose()
            }
        ]);
        
        this.background.current.setTransitions([
            {
                type: "opacity-out",
                duration: 200,
                callback: () => this.props?.onClose()
            }
        ]);
    };

    onRefresh() {
        this.setState({ refreshing: true });

        Cache.getActivityComments(this.props.activity, true).then(async (comments) => {
            const collection = [];

            for(let index = 0; index < comments.length; index++) {
                collection[index] = await Cache.getActivityComment(comments[index]);
            }
            
            this.setState({
                comments: collection,
                refreshing: false
            });
        });
    };

    render() {
        return (
            <>
                <Animation
                    ref={this.background}
                    enabled={this.state?.ready}
                    style={style.sheet.background}
                    />

                <Animation
                    ref={this.container}
                    enabled={this.state?.ready}
                    style={style.sheet.container}
                    >

                    <TouchableOpacity 
                        style={style.sheet.close}
                        onPress={() => this.onClose()}
                        />

                    <View style={style.sheet.content}>
                        <Text style={style.sheet.header}>Comments {this.state?.comments && (<Text style={style.sheet.header.count}>({this.state?.comments.length})</Text>)}</Text>

                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    tintColor={Appearance.theme.colorPalette.solid}
                                    refreshing={this.state?.refreshing}
                                    onRefresh={() => this.onRefresh()}
                                />
                            }
                        >
                            <View style={style.sheet.borders}>
                                <TouchableOpacity style={style.sheet.write} onPress={() => this.setState({ showReply: true, replyParent: null })}>
                                    <View style={style.sheet.write.avatar}>
                                        <Image
                                            style={style.sheet.write.avatar.image}
                                            source={require("assets/temp.jpg")}
                                        />
                                    </View>

                                    <View style={style.sheet.write.content}>
                                        <Text style={style.sheet.write.content.text}>Add a comment</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={style.sheet.comments}>
                                {this.state?.comments.filter(comment => comment.parent == null).map((comment) => (
                                    <View key={comment.id} style={style.sheet.comment}>
                                        <Image
                                            style={style.sheet.comment.image}
                                            source={require("assets/temp.jpg")}
                                        />

                                        <View style={style.sheet.comment.content}>
                                            <View style={style.sheet.comment.content.title}>
                                                <Text style={style.sheet.comment.content.author}>{comment.user.name}</Text>

                                                <Text style={style.sheet.comment.content.time}>{moment(comment.timestamp).fromNow()}</Text>
                                            </View>

                                            <Text style={style.sheet.comment.content.description}>{comment.text}</Text>
                                        
                                            <TouchableOpacity onPress={() => this.setState({ showReply: true, replyParent: comment.id })}>
                                                <Text style={style.sheet.comment.content.reply}>Reply</Text>
                                            </TouchableOpacity>

                                            <View>
                                                {this.state?.comments.filter(childComment => childComment.parent == comment.id).map((childComment) => (
                                                    <View key={childComment.id} style={[ style.sheet.comment, style.sheet.comment.child ]}>
                                                        <Image
                                                            style={style.sheet.comment.image}
                                                            source={require("assets/temp.jpg")}
                                                        />

                                                        <View style={style.sheet.comment.content}>
                                                            <View style={style.sheet.comment.content.title}>
                                                                <Text style={style.sheet.comment.content.author}>{childComment.user.name}</Text>

                                                                <Text style={style.sheet.comment.content.time}>{moment(childComment.timestamp).fromNow()}</Text>
                                                            </View>

                                                            <Text style={style.sheet.comment.content.description}>{childComment.text}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </Animation>

                {this.state?.showReply && (
                    <ActivityCommentReply activity={this.props.activity} parent={this.state?.replyParent || null} onClose={() => this.setState({ showReply: false })}/>
                )}
            </>
        );
    };
};
