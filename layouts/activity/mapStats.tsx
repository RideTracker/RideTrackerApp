import { Text, View } from "react-native"

export default function ActivityMapStats({ activity }) {
    return (
        <View style={{
            position: "absolute",

            bottom: 8,
            right: 0,

            width: "80%",
            paddingRight: "5%",

            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <View>
                <Text style={{ textShadowColor: "#FFF", textShadowRadius: 2, textAlign: "center", fontSize: 28, fontWeight: "500" }}>7.3<Text style={{ fontSize: 18 }}> km</Text></Text>
                <Text style={{ textShadowColor: "#FFF", textShadowRadius: 2, textAlign: "center", fontSize: 16 }}>distance</Text>
            </View>
            
            <View>
                <Text style={{ textShadowColor: "#FFF", textShadowRadius: 2, textAlign: "center", fontSize: 28, fontWeight: "500" }}>23.7<Text style={{ fontSize: 18 }}> km/h</Text></Text>
                <Text style={{ textShadowColor: "#FFF", textShadowRadius: 2, textAlign: "center", fontSize: 16 }}>average speed</Text>
            </View>
            
            <View>
                <Text style={{ textShadowColor: "#FFF", textShadowRadius: 2, textAlign: "center", fontSize: 28, fontWeight: "500" }}>33<Text style={{ fontSize: 18 }}> m</Text></Text>
                <Text style={{ textShadowColor: "#FFF", textShadowRadius: 2, textAlign: "center", fontSize: 16 }}>elevation</Text>
            </View>
        </View>
    );
};