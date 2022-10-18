import { Component } from "react";
import { Dimensions, View } from "react-native";

export default class Animation extends Component {
    componentDidMount() {
        if(this.props?.slide) {
            const width = Dimensions.get("window").width;
            
            this.interval = setInterval(() => {
                if(!this?.state?.slide)
                    return;

                this.setState({
                    now: performance.now()
                });
            }, this.props.slide / 100);

            this.setState({
                slide: {
                    enabled: true,
                    increment: width / this.props.slide,
                    left: width,
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
        if(this.state?.slide) {
            const now = performance.now();

            const currentDuration = now - this.state.slide.start;

            if(currentDuration < this.state.slide.duration) {
                const multiplier = currentDuration / this.state.slide.duration;

                const left = this.state.slide.left - (this.state.slide.left * multiplier);
    
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
