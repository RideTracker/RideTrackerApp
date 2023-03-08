import { useState, useEffect } from "react";
import { Image, Text, View } from "react-native";
import { BikeResponse, getBikeById } from "../models/bike";

type BikeProps = {
    id: string | null;

    style?: any;
};

export default function Bike({ id, style }: BikeProps) {
    const [ bike, setBike ]: [ BikeResponse, any] = useState(null);

    useEffect(() => {
        if(id !== null)
            getBikeById(id).then((result) => setBike(result));
    }, []);

    console.log(bike);

    return (
        <View style={style}>
            <View style={{ flexDirection: "row", height: 80, gap: 10 }}>
                <View style={{ width: "40%", borderRadius: 6, overflow: "hidden" }}>
                    {(bike)?(
                        <Image
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                            source={{
                                uri: bike.image
                            }}/>
                    ):(
                        <View style={{
                            backgroundColor: "#EEE",

                            width: "100%",
                            height: "100%"  
                        }}/>
                    )}
                </View>

                <View style={{
                    flex: 1,
                    paddingVertical: 2,
                    paddingHorizontal: 10,
                    justifyContent: "space-around",
                }}>
                    {(bike)?(
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "500"
                        }}>
                            {bike.model}
                        </Text>
                    ):(
                        <Text style={{
                            backgroundColor: "#EEE",
                            color: "transparent",

                            fontSize: 20,
                            fontWeight: "500"
                        }}>Bike name and model</Text>
                    )}

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <View>
                            <Text style={{
                                fontSize: 18,
                                textAlign: "center"
                            }}>
                                4
                            </Text>

                            <Text style={{ textAlign: "center" }}>rides</Text>
                        </View>

                        <View>
                            <Text style={{
                                fontSize: 18,
                                textAlign: "center"
                            }}>
                                39 km
                            </Text>

                            <Text style={{ textAlign: "center" }}>distance</Text>
                        </View>

                        <View>
                            <Text style={{
                                fontSize: 18,
                                textAlign: "center"
                            }}>
                                78 m
                            </Text>

                            <Text style={{ textAlign: "center" }}>elevation</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
