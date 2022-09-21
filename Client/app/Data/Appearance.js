import { Appearance as ReactAppearance } from "react-native";

import Config from "./Config";

import ThemeStyles from "./Config/ThemeStyles.json";

export default class Appearance {
    static theme = null;
    
    static readConfig() {
        let theme = Config.user?.theme || "light";

        if(ThemeStyles[theme] == undefined)
            theme = "light";

        if(theme == "system")
            theme = ReactAppearance.getColorScheme();

        this.theme = ThemeStyles[theme];

        this.theme.id = theme;
    };

    static setTheme(theme) {
        Config.user.theme = theme;

        this.readConfig();

        this.#listeners.filter(x => x.type == "change").forEach((item) => {
            item.listener(Math.random() * 100);
        });

        Config.saveAsync();
    };

    static #listeners = [];

    static addEventListener(type, listener) {
        this.#listeners.push({
            type, listener
        });
    };
};
