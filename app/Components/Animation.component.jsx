import { Component } from "react";
import { Dimensions, View } from "react-native";

export default class Animation extends Component {
    componentDidUpdate() {
        if(!this.props?.enabled)
            return;

        if(this.props?.transitions && !this.state?.initialized) {
            this.interval = setInterval(() => {
                this.setState({
                    now: performance.now()
                });
            }, this.props.duration / 100);
            
            this.setState({
                initialized: true,

                start: performance.now()
            });
        }
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    };

    render() {
        if(!this.state?.initialized) {
            return (
                <View style={[ this.props?.style, { opacity: 0.0 } ]}>
                    {this.props?.children}
                </View>
            );
        }

        const style = {};

        const now = performance.now();
        const currentDuration = now - this.state.start;

        if(currentDuration < this.props.duration) {
            if(this.props?.transitions.includes("opacity")) {
                if(currentDuration < this.props.duration) {
                    const multiplier = currentDuration / this.props.duration;

                    style.opacity = (1.0 * multiplier);
                }
            }

            if(this.props?.transitions.includes("slide-left")) {
                if(currentDuration < this.props.duration) {
                    const multiplier = currentDuration / this.props.duration;

                    const width = Dimensions.get("window").width;

                    style.left = width - (width * multiplier);
                }
            }
    
            return (
                <View style={[ this.props?.style, style ]}>
                    {this.props?.children}
                </View>
            );
        }
        
        if(this.interval) {
            clearInterval(this.interval);

            this.interval = undefined;
        }
        
        return (
            <View style={[ this.props?.style ]}>
                {this.props?.children}
            </View>
        );
    };
};
