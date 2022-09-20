import React, { Component } from "react";

import Appearance from "../Data/Appearance";

export default class ThemedComponent extends Component {
    style = null;

    constructor(...args) {
        super(...args);

        Appearance.addEventListener("change", (theme) => this.onThemeChange(theme));
    };

    onThemeChange(theme) {
        this.style?.update();
    
        this.setState({ theme });
    }
};
