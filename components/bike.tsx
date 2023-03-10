import { useState, useEffect } from "react";
import { Image, Text, View } from "react-native";
import { BikeResponse, getBikeById } from "../models/bike";
import { useThemeConfig } from "../utils/themes";

type BikeProps = {
    id?: string;
    data?: BikeResponse;

    style?: any;
};

export default function Bike({ id, style, data }: BikeProps) {
    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const [ bike, setBike ]: [ BikeResponse, any] = useState(null);

    useEffect(() => {
        if(data)
            setBike(data);
        else if(id)
            getBikeById(id).then((result) => setBike(result));
    }, []);

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
                            backgroundColor: themeConfig.placeholder,

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
                            fontWeight: "500",
                            color: themeConfig.color
                        }}>
                            {bike.model}
                        </Text>
                    ):(
                        <Text style={{
                            backgroundColor: themeConfig.placeholder,
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
                                textAlign: "center",
                                color: themeConfig.color
                            }}>
                                4
                            </Text>

                            <Text style={{
                                textAlign: "center",
                                color: themeConfig.color
                                }}>
                                    rides
                            </Text>
                        </View>

                        <View>
                            <Text style={{
                                fontSize: 18,
                                textAlign: "center",
                                color: themeConfig.color
                            }}>
                                39 km
                            </Text>

                            <Text style={{
                                textAlign: "center",
                                color: themeConfig.color
                                }}>
                                    distance
                            </Text>
                        </View>

                        <View>
                            <Text style={{
                                fontSize: 18,
                                textAlign: "center",
                                color: themeConfig.color
                            }}>
                                78 m
                            </Text>

                            <Text style={{
                                textAlign: "center",
                                color: themeConfig.color
                                }}>
                                    elevation
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
