import { useState, useEffect, ReactNode } from "react";
import { Image, View, ViewStyle } from "react-native";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import { ParagraphText } from "./texts/Paragraph";
import { getBike } from "@ridetracker/ridetrackerclient";
import { useClient } from "../modules/useClient";
import Constants from "expo-constants";

type BikeProps = {
    id?: string;
    buttons?: ReactNode;

    style?: ViewStyle;
};

type BikeData = {
    name: string;
    model?: string;
    image: string;
    activities: number;

    summary: {
        key: string;
        value: number;
    }[];
};

export default function Bike(props: BikeProps) {
    const { id, style, buttons } = props;

    const client = useClient();
    const theme = useTheme();

    const [ bike, setBike ] = useState<BikeData | null>(null);

    useEffect(() => {
        if(id) {
            getBike(client, id).then((result) => {
                if(!result.success)
                    return;

                console.log(result.bike);

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
                                    uri: `${Constants.expoConfig.extra.images}/${bike.image}/RideTrackerBike`
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
                        <CaptionText placeholder={!bike}>{bike?.name}</CaptionText>

                        {(bike) && (buttons)}
                    </View>

                    {(bike)?(
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <View>
                                <ParagraphText style={{ textAlign: "center", fontSize: 18 }}>{bike?.activities}</ParagraphText>
                                <ParagraphText style={{ textAlign: "center" }}>rides</ParagraphText>
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
