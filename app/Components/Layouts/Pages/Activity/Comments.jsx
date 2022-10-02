import { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";

import moment from "moment";

import Cache from "app/Data/Cache";

import Input from "app/Components/Input.component";
import ActivityCommentReply from "./Comments/Reply";

import style from "./Comments.style";

export default class ActivityComments extends Component {
    style = style.update();

    componentDidMount() {
        Cache.getActivityComments(this.props.activity).then((comments) => {
            this.setState({ comments });
        });
    };

    render() {
        return (
            <>
                <View style={style.sheet}>
                    <TouchableOpacity style={style.sheet.close} onPress={() => this.props?.onClose()}/>

                    <View style={style.sheet.container}>
                        <Text style={style.sheet.header}>Comments {this.state?.comments && (<Text style={style.sheet.header.count}> ({this.state?.comments.length})</Text>)}</Text>

                        <ScrollView>
                            <View style={style.sheet.borders}>
                                <TouchableOpacity style={style.sheet.write} onPress={() => this.setState({ showReply: true })}>
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
                                {this.state?.comments.map((comment) => (
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

                                            <Text style={style.sheet.comment.content.description}>That's amazing! I'm definitely going to add this path to my route...</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {this.state?.showReply && (
                    <ActivityCommentReply type="activity" activity={this.props.activity} onClose={() => this.setState({ showReply: false })}/>
                )}
            </>
        );
    };
};
