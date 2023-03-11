import { useState, useEffect } from "react";
import { Image, Text, View } from "react-native";
import { BikeResponse, getBikeById } from "../models/bike";
import { useThemeConfig } from "../utils/themes";
import { useSelector } from "react-redux";

type BikeProps = {
    id?: string;
    data?: BikeResponse;

    style?: any;
};

export default function Bike({ id, style, data }: BikeProps) {
    const userData = useSelector((state: any) => state.userData);

    const themeConfig = useThemeConfig();
    useEffect(() => {}, [themeConfig]);

    const [ bike, setBike ]: [ BikeResponse, any] = useState(null);

    useEffect(() => {
        if(data)
            setBike(data);
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
                                
                                color: (bike?.summary)?(themeConfig.color):("transparent"),
                                backgroundColor: (bike?.summary)?("transparent"):(themeConfig.placeholder)
                            }}>
                                {bike?.summary?.rides}
                            </Text>

                            <Text style={{
                                textAlign: "center",
                                
                                color: (bike?.summary)?(themeConfig.color):("transparent"),
                                backgroundColor: (bike?.summary)?("transparent"):(themeConfig.placeholder)
                                }}>
                                    rides
                            </Text>
                        </View>

                        <View>
                            <Text style={{
                                fontSize: 18,
                                textAlign: "center",
                                
                                color: (bike?.summary)?(themeConfig.color):("transparent"),
                                backgroundColor: (bike?.summary)?("transparent"):(themeConfig.placeholder)
                            }}>
                                {bike?.summary?.distance} km
                            </Text>

                            <Text style={{
                                textAlign: "center",
                                
                                color: (bike?.summary)?(themeConfig.color):("transparent"),
                                backgroundColor: (bike?.summary)?("transparent"):(themeConfig.placeholder)
                                }}>
                                    distance
                            </Text>
                        </View>

                        <View>
                            <Text style={{
                                fontSize: 18,
                                textAlign: "center",
                                
                                color: (bike?.summary)?(themeConfig.color):("transparent"),
                                backgroundColor: (bike?.summary)?("transparent"):(themeConfig.placeholder)
                            }}>
                                {bike?.summary?.elevation} m
                            </Text>

                            <Text style={{
                                textAlign: "center",
                                
                                color: (bike?.summary)?(themeConfig.color):("transparent"),
                                backgroundColor: (bike?.summary)?("transparent"):(themeConfig.placeholder)
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
