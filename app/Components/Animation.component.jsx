import { Component } from "react";
import { Dimensions, View } from "react-native";

export default class Animation extends Component {
    componentDidUpdate() {
        if(!this.props?.enabled)
            return;

        if(this.props?.slide && !this.state?.slide) {
            this.interval = setInterval(() => {
                if(!this?.state?.slide)
                    return;

                this.setState({
                    now: performance.now()
                });
            }, this.props.slide / 100);

            const width = Dimensions.get("window").width;
            
            this.setState({
                slide: {
                    width,
                    duration: this.props.slide,
                    start: performance.now()
                }
            });
        }
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    };

    render() {
        if(!this.props?.enabled) {
            return (
                <View style={[ this.props?.style, { opacity: 0.0 } ]}>
                    {this.props?.children}
                </View>
            );
        }

        if(this.state?.slide) {
            const now = performance.now();

            const currentDuration = now - this.state.slide.start;

            if(currentDuration < this.state.slide.duration) {
                const multiplier = currentDuration / this.state.slide.duration;

                const left = this.state.slide.width - (this.state.slide.width * multiplier);
    
                return (
                    <View style={[ this.props?.style, { left } ]}>
                        {this.props?.children}
                    </View>
                );
            }

            if(this.interval) {
                clearInterval(this.interval);
                this.interval = undefined;
            }
        }
        
        return (
            <View style={this.props?.style}>
                {this.props?.children}
            </View>
        );
    };
};
