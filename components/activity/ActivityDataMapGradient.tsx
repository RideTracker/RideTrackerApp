import { scale } from "chroma.ts";
import { View, Text } from "react-native";

export type ActivityDataMapGradientProps = {
    getUnit: (index: number) => string;
}

export default function ActivityDataMapGradient({ getUnit }: ActivityDataMapGradientProps) {
    return (
        <View style={{
            position: "absolute",

            bottom: 0,
            right: 0,
            
            padding: 10,

            width: "100%",

            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: 5,

            flexDirection: "row"
        }}>
            <View style={{
                maxWidth: "70%",
                flexDirection: "row",
            }}>
                {Array(5).fill(null).map((_, index, array) => (
                    <View key={index} style={{
                        gap: 5,
                        flex: 1
                    }}>
                        <Text style={{
                            color: "silver",
                            fontSize: 10,
                            paddingRight: 5
                        }} numberOfLines={1}>
                            {getUnit(index)}
                        </Text>

                        <View style={{
                            backgroundColor: scale([ "green", "orange", "red" ])(index / (array.length - 1)).toString(),
                            height: 8
                        }}/>
                    </View>
                ))}
            </View>
        </View>
    );
};
