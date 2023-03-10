import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ActivityMapStats({ activity }) {
    return (
        <LinearGradient 
            colors={[ "transparent", "rgba(20, 20, 20, .4)" ]}
            locations={[ 0.5, 1 ]}
            style={{
            position: "absolute",

            right: 0,

            width: "100%",
            paddingRight: "5%",
            paddingLeft: "20%",
            paddingBottom: 8,
            height: "100%",

            borderRadius: 10,

            alignItems: "flex-end",

            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <View>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28, fontWeight: "500" }}>7.3<Text style={{ fontSize: 18 }}> km</Text></Text>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16 }}>distance</Text>
            </View>
            
            <View>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28, fontWeight: "500" }}>23.7<Text style={{ fontSize: 18 }}> km/h</Text></Text>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16 }}>average speed</Text>
            </View>
            
            <View>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 28, fontWeight: "500" }}>33<Text style={{ fontSize: 18 }}> m</Text></Text>
                <Text style={{ color: "#FFF", textAlign: "center", fontSize: 16 }}>elevation</Text>
            </View>
        </LinearGradient>
    );
};
