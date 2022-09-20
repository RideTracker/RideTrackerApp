import React, { Component } from "react";

import Appearance from "../Data/Appearance";

export default class ThemedComponent extends Component {
    //style = null;

    constructor(...args) {
        super(...args);

        Appearance.addEventListener("change", (theme) => this.onThemeChange(theme));
    };

    componentDidUpdate(...args) {
        return this.themedComponentDidUpdate(...args);
    };

    themedComponentDidUpdate(previousProps, previousState) {
        if(previousState?.theme != Appearance.theme.id) {
            this.style?.update();

            this.setState({ theme: Appearance.theme.id });
        }
    };

    onThemeChange(theme) {
        this.style?.update();
    
        this.setState({ theme });
    }
};
