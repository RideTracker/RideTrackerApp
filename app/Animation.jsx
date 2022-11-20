import { Component } from "react";
import { View } from "react-native";

export default class Animation extends Component {
    transitions = [];
    style = {};

    componentDidMount() {
        if(this.props?.transitions)
            this.setTransitions(this.props.transitions);
    };

    componentWillUnmount() {
        this.clearTransitions();
        
        if(this.interval)
            clearInterval(this.interval);
    };

    clearTransitions() {
        if(!this.state?.transitions)
            return;

        this.transitions = [];
    };

    setTransitions(transitions) {
        this.clearTransitions();

        const now = performance.now();

        this.addTransitions(transitions.map((transition) => {
            return {
                start: now,

                ...transition
            };
        }));
    };

    addTransitions(transitions) {
        this.transitions.push(...transitions);

        if(!this.interval) {
            this.interval = setInterval(() => {
                if(!this.interval)
                    return;
                    
                const now = performance.now();
        
                this.transitions = this.transitions.filter((transition) => {
                    if(transition.completed) {
                        if(transition.callback)
                            transition.callback();

                        return false;
                    }

                    return true;
                });

                if(!this.transitions.length) {
                    clearInterval(this.interval);
        
                    this.interval = undefined;
                }

                this.setState({ now });
            }, 10);
        }
    };

    render() {
        if(!this.props?.enabled || !this.state?.now) {
            return (
                <View style={[ this.props?.style, { opacity: 0.0 } ]}>
                    {this.props?.children}
                </View>
            );
        }

        this.transitions.forEach((transition, index) => {
            if(transition.completed)
                return;

            const currentDuration = this.state.now - transition.start;
    
            let multiplier = currentDuration / transition.duration;

            if(multiplier >= 1.0) {
                multiplier = 1.0;

                transition.completed = true;
            }

            if(transition.ease ?? true)
                multiplier = (multiplier < 0.5)?(2 * multiplier * multiplier):(-1 + (4 - (2 * multiplier)) * multiplier);

            if(transition.direction == "out")
                multiplier = 1.0 - multiplier;

            switch(transition.type) {
                case "opacity": {
                    this.style.opacity = multiplier;

                    break;
                }

                case "bottom": {
                    this.style.top = `${100 - (100 * multiplier)}%`;

                    break;
                }

                case "left": {
                    this.style.left = `${100 - (100 * multiplier)}%`;

                    break;
                }
            }
        });
    
        return (
            <View style={[ this.props?.style, { ...this.style } ]}>
                {this.props?.children}
            </View>
        );
    };
};
