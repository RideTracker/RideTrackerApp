import { useState, useEffect } from "react";
import { Image, View } from "react-native";
import { BikeResponse, getBikeById } from "../models/bike";
import { useTheme } from "../utils/themes";
import { useSelector } from "react-redux";
import { CaptionText } from "./texts/caption";
import { ParagraphText } from "./texts/paragraph";
import { useUser } from "../modules/user/useUser";

type BikeProps = {
    id?: string;
    data?: BikeResponse;
    buttons?: any;

    style?: any;
};

export default function Bike(props: BikeProps) {
    const { id, style, data, buttons } = props;

    const userData = useUser();

    const theme = useTheme();

    const [ bike, setBike ]: [ BikeResponse, any] = useState(null);

    useEffect(() => {
        if(data)
            setBike(data);
        else if(id) {
            getBikeById(userData.key, id).then((result) => {
                if(result.success)
                    setBike(result.bike);
            });
        }
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
                            backgroundColor: theme.placeholder,

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
                            backgroundColor: theme.placeholder,
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

                            backgroundColor: theme.placeholder
                        }}/>
                    )}
                </View>
            </View>
        </View>
    );
};
