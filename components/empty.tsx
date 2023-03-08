import { Text, View } from "react-native";

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
                <Text style={{ fontSize: 100 }}>-</Text>
                <Text style={{ fontSize: 20 }}>There's nothing here!</Text>
            </View>

            {children}
        </View>
    );
};
