import { Text } from "react-native";

import Appearance from "app/Data/Appearance";

export default function Title({ text }) {
    return (
        <Text
            style={{
                marginVertical: 4,

                color: Appearance.theme.colorPalette.secondary,

                fontSize: 16,
                fontWeight: "bold"
            }}
            >
            {text}
        </Text>
    );
};
