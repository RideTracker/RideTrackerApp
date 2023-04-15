import { useState, useEffect } from "react";
import { Image, Text, View } from "react-native";
import { BikeResponse } from "../models/bike";
import { useThemeConfig } from "../utils/themes";
import { useSelector } from "react-redux";
import { CaptionText } from "./texts/caption";
import { ParagraphText } from "./texts/paragraph";

type BikeProps = {
    id?: string;
    data?: BikeResponse;
    buttons?: any;

    style?: any;
};

export default function Bike({ id, style, data, buttons }: BikeProps) {
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
                <View style={{ width: 140, borderRadius: 6, overflow: "hidden" }}>
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
                    gap: 5
                }}>
                    {(bike)?(
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <CaptionText>{bike.model}</CaptionText>

                            {buttons}
                        </View>
                    ):(
                        <CaptionText style={{
                            backgroundColor: themeConfig.placeholder,
                            color: "transparent"
                        }}>
                            Name
                        </CaptionText>
                    )}

                    {(bike)?(
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <View>
                                <ParagraphText style={{ textAlign: "center", fontSize: 18 }}>{bike?.summary?.rides}</ParagraphText>
                                <ParagraphText style={{ textAlign: "center" }}>rides</ParagraphText>
                            </View>

                            <View>
                                <ParagraphText style={{ textAlign: "center", fontSize: 18 }}>{bike?.summary?.distance} km</ParagraphText>
                                <ParagraphText style={{ textAlign: "center" }}>distance</ParagraphText>
                            </View>

                            <View>
                                <ParagraphText style={{ textAlign: "center", fontSize: 18 }}>{bike?.summary?.elevation} m</ParagraphText>
                                <ParagraphText style={{ textAlign: "center" }}>elevation</ParagraphText>
                            </View>
                        </View>
                    ):(
                        <View style={{
                            height: 16,

                            flexGrow: 1,

                            backgroundColor: themeConfig.placeholder
                        }}/>
                    )}
                </View>
            </View>
        </View>
    );
};
