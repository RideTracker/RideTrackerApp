import React, { Component } from "react";

import Config from "app/Data/Config";

import { SubPage, Form } from "app/Components";

export default class FilterPage extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.page = React.createRef();
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

    async onUpdate() {
        if(!this.state)
            return this.page.current.onClose();

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

        this.page.current.onClose();
    };

    async onResetPress() {
        Config.user.filter = {};

        await Config.saveAsync();
        
        if(this.props.onUpdate)
            this.props.onUpdate();

        this.page.current.onClose();
    };

    render() {
        return (
            <SubPage ref={this.page} onClose={() => this.props.onClose()}>
                <Form>
                    <Form.Field>
                        <Form.Title
                            text={"Sort activities by:"}
                            />

                        <Form.Selection
                            items={this.options.sort}
                            default={Config.user?.filter?.sort ?? this.options.sort.find((x) => x.default).value}
                            onChange={(value) => this.setState({ sort: value })}
                            />
                    </Form.Field>
                
                    <Form.Field>
                        <Form.Title
                            text={"Include activities within:"}
                            />

                        <Form.Selection
                            items={this.options.timeframe}
                            default={Config.user?.filter?.timeframe ?? this.options.timeframe.find((x) => x.default).value}
                            onChange={(value) => this.setState({ timeframe: value })}
                            />
                    </Form.Field>

                    <Form.Field>
                        <Form.Button
                            branded
                            title={"Update filter"}
                            onPress={() => this.onUpdate()}
                            />
                    </Form.Field>
                    
                    <Form.Field>
                        <Form.Button
                            confirm
                            title={"Reset to default"}
                            onPress={() => this.onResetPress()}
                            />
                    </Form.Field>
                </Form>
            </SubPage>
        );
    };
};
