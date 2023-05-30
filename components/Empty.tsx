import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { CaptionText } from "./texts/Caption";

type EmptyProps = {
    style?: ViewStyle;
    children?: ReactNode;
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
}
