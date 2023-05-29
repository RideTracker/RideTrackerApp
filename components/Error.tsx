import { Text, View } from "react-native";

type ErrorProps = {
    style?: any;
    children?: any;
};

export default function Error({ style, children }: ErrorProps) {
    return (
        <View style={style}>
            <View style={{
                flex: 1,
                alignItems: "center",

                marginVertical: 20
            }}>
                <Text style={{ fontSize: 100 }}>?!</Text>
                <Text style={{ fontSize: 20 }}>Something went wrong!</Text>
            </View>

            {children}
        </View>
    );
}
