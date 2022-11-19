import { Text } from "react-native";

import Appearance from "app/Data/Appearance";

export default function Description({ text }) {
    return (
        <Text
            style={{
                marginVertical: 4,

                color: Appearance.theme.colorPalette.secondary,

                fontSize: 14
            }}
            >
            {text}
        </Text>
    );
};
