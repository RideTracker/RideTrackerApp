import { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default class Tabs extends Component {
    getCurrent() {
        return this.state?.tab ?? this.props.default;
    };

    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <View style={{
                    flexDirection: "row",

                    borderBottomWidth: 1,
                    borderBottomColor: Appearance.theme.colorPalette.border
                }}>
                    {this.props.children.map((child) => (
                        <TouchableOpacity
                            key={child.props.id}
                            onPress={() => this.setState({ tab: child.props.id})}
                            style={((this.state?.tab ?? this.props.default) == child.props.id) && ({
                                borderBottomWidth: 2,
                                borderBottomColor: Appearance.theme.colorPalette.route
                            })}>
                            <Text style={{
                                color: Appearance.theme.colorPalette.secondary,
                        
                                paddingHorizontal: 12,
                                paddingVertical: 12,
            
                                fontSize: 18
                            }}>
                                {child.props.title}
                            </Text>
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
