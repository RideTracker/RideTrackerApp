import { Alert } from "react-native";

import config from "root/config.json";

export default class Production {
    static prompt() {
        if(config.production != "demo")
            return;

        Alert.alert("Production mode", "You're connected to a demo server and you're unaffected by activity on the production server.",
            [
                {
                    text: "Read more",
                    onPress: () => {
                        Alert.alert("Production mode", "To avoid public destruction and eventual security flaws:\n\nYour application is connected to a seperate server with a seperate database than the public server.\n\nYour functionality remains the same.");
                    }
                },

                { text: "OK" }
            ]
        );
    };

    static get() {
        return config.production;
    };
};
