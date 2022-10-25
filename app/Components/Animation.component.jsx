import { Component } from "react";
import { Dimensions, View } from "react-native";

export default class Animation extends Component {
    transitions = [];
    direction = "in";

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

        if(this.transitions[this.transitions.length - 1].type.endsWith("out"))
            this.direction = "out";
        else
            this.direction = "in";

        if(!this.interval)
            this.interval = setInterval(() => {
                const now = performance.now();
        
                this.transitions = this.transitions.filter((transition) => {
                    const currentDuration = now - transition.start;
            
                    if(currentDuration >= transition.duration) {
                        if(transition.callback)
                            transition.callback();

                        return false;
                    }

                    return true;
                });

                this.setState({ now });
            }, 10);
    };

    render() {
        if(!this.props?.enabled) {
            return (
                <View style={[ this.props?.style, { opacity: 0.0 } ]}>
                    {this.props?.children}
                </View>
            );
        }

        if(!this.transitions.length) {
            if(this.interval) {
                clearInterval(this.interval);
    
                this.interval = undefined;
            }

            return (
                <View style={[ this.props?.style, { opacity: (this.direction == "in")?(1.0):(0.0) } ]}>
                    {this.props?.children}
                </View>
            );
        }

        this.style = {};
        const now = performance.now();

        this.transitions.forEach((transition) => {
            const currentDuration = now - transition.start;
    
            if(currentDuration < transition.duration) {
                let multiplier = currentDuration / transition.duration;

                if(transition.ease)
                    multiplier = (multiplier < 0.5)?(2 * multiplier * multiplier):(-1 + (4 - (2 * multiplier)) * multiplier);

                switch(transition.type) {
                    case "opacity": {
                        this.style.opacity = multiplier;

                        break;
                    }

                    case "opacity-out": {
                        this.style.opacity = 1.0 - multiplier;

                        break;
                    }

                    case "bottom": {
                        const height = Dimensions.get("window").height;

                        this.style.top = height - (height * multiplier);

                        break;
                    }

                    case "bottom-out": {
                        const height = Dimensions.get("window").height;

                        this.style.top = height * multiplier;

                        break;
                    }

                    case "left": {
                        const width = Dimensions.get("window").width;

                        this.style.left = width - (width * multiplier);

                        break;
                    }
                }
            }
        });
    
        return (
            <View style={[ this.props?.style, this.style ]}>
                {this.props?.children}
            </View>
        );
    };
};
