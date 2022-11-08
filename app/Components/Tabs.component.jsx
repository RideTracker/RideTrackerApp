import { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import style from "./Tabs.component.style";

export default class Tabs extends Component {
    style = style.update();

    getCurrent() {
        return this.state?.tab ?? this.props.default;
    };

    render() {
        return (
            <View style={style.sheet}>
                <View style={style.sheet.tabs}>
                    {this.props.children.map((child) => (
                        <TouchableOpacity key={child.props.id} onPress={() => this.setState({ tab: child.props.id})} style={[ style.sheet.tabs.tab, ((this.state?.tab ?? this.props.default) == child.props.id) && style.sheet.tabs.tab.active ]}>
                            <Text style={style.sheet.tabs.tab.text}>{child.props.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View>
                    {this.props.children.find((child) => child.props.id == (this.state?.tab ?? this.props.default))}
                </View>
            </View>
        );
    };
};
