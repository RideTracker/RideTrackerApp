import { useState, useEffect, ReactNode } from "react";
import { Image, View, ViewStyle } from "react-native";
import { useTheme } from "../utils/themes";
import { CaptionText } from "./texts/Caption";
import { ParagraphText } from "./texts/Paragraph";
import { getBike } from "@ridetracker/ridetrackerclient";
import { useClient } from "../modules/useClient";
import Constants from "expo-constants";
import { ActivitySummary } from "./ActivitySummary";
import { BikeActivitySummary } from "./BikeActivitySummary";
import BikeType, { BikeTypes } from "./BikeTypes";

type BikeProps = {
    id?: string;
    buttons?: ReactNode;
    style?: ViewStyle;
};

type BikeData = {
    name: string;
    model?: string;
    image: string;
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
                        backgroundColor: (!bike)?(theme.placeholder):("transparent")
                    }}>
                        {(bike) && (
                            (bike.image)?(
                                <Image
                                    style={{
                                        flex: 1
                                    }}
                                    source={{
                                        uri: `${Constants.expoConfig.extra.images}/${bike.image}/RideTrackerBike`
                                    }}/>
                            ):(
                                <View style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center" }}>
                                    <BikeType type={bike.model} withName={true} color="grey"/>
                                </View>
                            )
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
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <CaptionText placeholder={!bike}>{bike?.name}</CaptionText>

                        {(bike) && (
                            <View style={{ flexDirection: "row", gap: 10, marginLeft: "auto" }}>
                                {buttons}
                            </View>
                        )}
                    </View>

                    {(bike)?(
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            {bike.summary.filter((summary) => summary.key === "activities" || summary.key === "distance" || summary.key === "elevation").slice(0, 3).map((summary) => (
                                <BikeActivitySummary key={summary.key} type={summary.key} value={summary.value} color={theme.color}/>
                            ))}
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
