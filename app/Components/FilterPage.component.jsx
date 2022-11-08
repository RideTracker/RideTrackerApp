import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

import Appearance from "app/Data/Appearance";
import Config from "app/Data/Config";

import Button from "app/Components/Button.component";
import Input from "app/Components/Input.component";
import Animation from "app/Components/Animation.component";
import Header from "app/Components/Layouts/Header.component";

import style from "./FilterPage.component.style";

export default class FilterPage extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.animation = React.createRef();
    };

    options = {
        sort: [
            { value: "newest", text: "Newest", default: true },
            { value: "oldest", text: "Oldest" },
            { value: "speed", text: "Average speed" },
            { value: "elevation", text: "Most elevation gained" },
            { value: "distance", text: "Longest distance" },
            //{ value: "duration", text: "Longest duration" },
            /*{ value: "likes", text: "Most likes" },
            { value: "comments", text: "Most comments" },
            { value: "activity", text: "Most recent interaction" }*/
        ],
        
        timeframe: [
            { value: "last_week", text: "Within last week" },
            { value: "last_month", text: "Within last month" },
            { value: "last_year", text: "Within last year" },
            { value: "all_time", text: "Within all time", default: true },
        ]
    };

    onClose() {
        this.animation.current.setTransitions([
            {
                type: "bottom",
                direction: "out",
                duration: 200,
                callback: () => this.props.onClose()
            },

            {
                type: "opacity",
                direction: "out",
                duration: 200
            }
        ]);
    };

    async onUpdate() {
        if(!this.state)
            return this.onClose();

        if(!Config.user?.filter)
            Config.user.filter = {};

        for(let key in this.options) {
            if(this.state.hasOwnProperty(key)) {
                Config.user.filter[key] = this.state[key]
            }
        }

        await Config.saveAsync();
        
        if(this.props.onUpdate)
            this.props.onUpdate();

        this.onClose();
    };

    async onResetPress() {
        Config.user.filter = {};

        await Config.saveAsync();
        
        if(this.props.onUpdate)
            this.props.onUpdate();

        this.onClose();
    };

    render() {
        return (
            <Animation
                ref={this.animation}
                enabled={true}
                style={style.sheet}
                transitions={[
                    {
                        type: "bottom",
                        duration: 200
                    },
                    
                    {
                        type: "opacity",
                        duration: 200
                    }
                ]}
                >
                <TouchableOpacity style={style.sheet.overlay} onPress={() => this.onClose()}/>

                <View style={style.sheet.content}>
                    <View style={style.sheet.form}>
                        <View style={style.sheet.form.input}>
                            <Text style={style.sheet.form.text}>Sort activities by:</Text>

                            <Picker
                                selectedValue={this.state?.sort ?? Config.user?.filter?.sort ?? this.options.sort.find((x) => x.default).value}
                                onValueChange={(value, index) => this.setState({ sort: value })}
                                dropdownIconColor={Appearance.theme.colorPalette.secondary}
                                dropdownIconRippleColor={Appearance.theme.colorPalette.secondary}
                                mode={"dropdown"}
                                >
                                {this.options.sort.map((option) => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.text}
                                        value={option.value}
                                        style={{ color: Appearance.theme.colorPalette.secondary, backgroundColor: Appearance.theme.colorPalette.background }}
                                        />
                                ))}
                            </Picker>
                        </View>
                    
                        <View style={style.sheet.form.input}>
                            <Text style={style.sheet.form.text}>Include activities within:</Text>

                            <Picker
                                selectedValue={this.state?.timeframe ?? Config.user?.filter?.timeframe ?? this.options.timeframe.find((x) => x.default).value}
                                onValueChange={(value, index) => this.setState({ timeframe: value })}
                                dropdownIconColor={Appearance.theme.colorPalette.secondary}
                                dropdownIconRippleColor={Appearance.theme.colorPalette.secondary}
                                mode={"dropdown"}
                                >
                                {this.options.timeframe.map((option) => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.text}
                                        value={option.value}
                                        style={{ color: Appearance.theme.colorPalette.secondary, backgroundColor: Appearance.theme.colorPalette.background }}
                                        />
                                ))}
                            </Picker>
                        </View>

                        <View style={style.sheet.form.input}>
                            <Button branded title={"Update filter"} onPress={() => this.onUpdate()}/>
                        </View>
                        
                        <View style={style.sheet.form.input}>
                            <Button confirm title={"Reset to default"} onPress={() => this.onResetPress()}/>
                        </View>
                    </View>
                </View>
            </Animation>
        );
    };
};
