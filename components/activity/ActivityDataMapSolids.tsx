import { scale } from "chroma.ts";
import { View, Text } from "react-native";

export type ActivityDataMapSolidsProps = {
    units: {
        color: string;
        unit: string;
    }[];
};

export default function ActivityDataMapSolids({ units }: ActivityDataMapSolidsProps) {
    return (
        <View style={{
            position: "absolute",

            top: 0,
            right: 0,
            
            padding: 10,

            width: "100%",

            justifyContent: "flex-end",

            gap: 5,

            flexDirection: "row"
        }}>
            <View style={{
                flexDirection: "column",
            }}>
                {units.map((item) => (
                    <View key={item.unit} style={{
                        gap: 5,
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end"
                    }}>
                        <Text style={{
                            color: "silver",
                            fontSize: 10,
                            paddingRight: 5
                        }} numberOfLines={1}>
                            {item.unit}
                        </Text>

                        <View style={{
                            backgroundColor: item.color,
                            height: 8,
                            width: "30%"
                        }}/>
                    </View>
                ))}
            </View>
        </View>
    );
};
