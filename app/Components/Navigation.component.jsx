import { Component } from "react";
import { View } from "react-native";

export default class Navigation extends Component {
    render() {
        return (
            <View style={[ this.props.style, { flex: 1 } ]}>
                {this.props.children.find(x => x.props.link == this.props.path)}
            </View>
        );
    };

    static Page = class Page extends Component {
        render() {
            return this.props.children;
        };
    };
};
