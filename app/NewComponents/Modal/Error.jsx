import { View, Text } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Appearance from "app/Data/Appearance";

export default function Error({ color, title, description }) {
    return (
        <View
            style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center",
                width: "80%",

                marginLeft: "auto",
                marginRight: "auto"
            }}
            >
            <FontAwesome5
                name={"exclamation-triangle"}
                style={{
                    color: color ?? Appearance.theme.colorPalette.secondary,

                    fontSize: 64,

                    marginVertical: 6
                }}
                />

            <Text
                style={{
                    color: color ?? Appearance.theme.colorPalette.secondary,

                    fontSize: 24,
                    fontWeight: "bold",

                    marginVertical: 6
                }}
                >
                {title ?? "Something went wrong!"}
            </Text>

            {(description) && (
                <Text
                    style={{
                        color: color ?? Appearance.theme.colorPalette.secondary,

                        fontSize: 16,
                        
                        marginVertical: 6
                    }}
                    >
                        {description}
                </Text>
            )}
        </View>
    );
};
