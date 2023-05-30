import { useState, useEffect, ReactNode } from "react";
import { Image, View, ViewStyle } from "react-native";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import { ParagraphText } from "./texts/Paragraph";
import { getBike } from "@ridetracker/ridetrackerclient";
import { useClient } from "../modules/useClient";

type BikeProps = {
    id?: string;
    data?: any;
    buttons?: ReactNode;

    style?: ViewStyle;
};

export default function Bike(props: BikeProps) {
    const { id, style, data, buttons } = props;

    const client = useClient();
    const theme = useTheme();

    const [ bike, setBike ] = useState<any | null>(data);

    useEffect(() => {
        if(id) {
            getBike(client, id).then((result) => {
                if(!result.success)
                    return;

                setBike(result.bike);
            });
        }
    }, []);

    return (
        <View style={style}>
            <View style={{ flexDirection: "row", height: 80, gap: 10 }}>
                <View style={{ width: 140, borderRadius: 6, overflow: "hidden" }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: theme.placeholder
                    }}>
                        {(bike) && (
                            <Image
                                style={{
                                    flex: 1
                                }}
                                source={{
                                    uri: bike.image
                                }}/>
                        )}
                    </View>
                </View>

                <View style={{
                    flex: 1,
                    paddingVertical: 2,
                    paddingHorizontal: 10,
                    justifyContent: "space-around",
                    gap: 5
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <CaptionText placeholder={!bike}>{bike?.model}</CaptionText>

                        {(bike) && (buttons)}
                    </View>

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
}
