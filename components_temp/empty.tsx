import { Text, View } from "react-native";
import { CaptionText } from "./texts/caption";

type EmptyProps = {
    style?: any;
    children?: any;
};

export default function Empty({ style, children }: EmptyProps) {
    return (
        <View style={style}>
            <View style={{
                flex: 1,
                alignItems: "center",

                marginVertical: 20
            }}>
                <CaptionText>There's nothing here!</CaptionText>
            </View>

            {children}
        </View>
    );
};
