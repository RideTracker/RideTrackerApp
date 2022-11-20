import { Component } from "react";
import { Picker } from "@react-native-picker/picker";

import Appearance from "app/Data/Appearance";

export default class Selection extends Component {
    getValue() {
        return this.state?.value ?? this.props?.default;
    };

    onValueChange(value) {
        this.setState({ value });

        if(this.props?.onChange)
            this.props.onChange(value);
    };

    render() {
        return (
            <Picker
                selectedValue={this.state?.value ?? this.props?.default}
                onValueChange={(value) => this.onValueChange(value)}
                dropdownIconColor={Appearance.theme.colorPalette.secondary}
                dropdownIconRippleColor={Appearance.theme.colorPalette.secondary}
                mode={"dropdown"}
                >
                {(this.props?.items) && this.props.items.map((item) => (
                    <Picker.Item
                        key={item.value}
                        label={item.text}
                        value={item.value}
                        style={{ color: Appearance.theme.colorPalette.secondary, backgroundColor: Appearance.theme.colorPalette.background }}
                        />
                ))}
            </Picker>
        );
    };
};
