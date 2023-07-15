import { GetActivityResponse } from "@ridetracker/ridetrackerclient";
import React, { ReactNode } from "react";
import { View, Image } from "react-native";
import { ParagraphText } from "./texts/Paragraph";
import { FontAwesome5 } from "@expo/vector-icons";
import { ActivityMapDetail } from "./ActivityMapDetail";
import BikeType, { BikeTypes } from "./BikeTypes";
import { useUser } from "../modules/user/useUser";

export type ActivityMapDetailsProps = {
    activity: {
        visibility: GetActivityResponse["activity"]["visibility"];

        bike?: GetActivityResponse["activity"]["bike"];
    };
};

function getActivityVisibilityDetail(visibility: GetActivityResponse["activity"]["visibility"]) {
    switch(visibility) {
        case "PRIVATE": {
            return (
                <ActivityMapDetail>
                    <FontAwesome5 name="lock" size={14} color={"white"} />

                    <ParagraphText style={{
                        textTransform: "capitalize",

                        color: "white",

                        fontSize: 14
                    }}>
                        Private
                    </ParagraphText>
                </ActivityMapDetail>
            );
        }

        case "FOLLOWERS_ONLY": {
            return (
                <ActivityMapDetail>
                    <FontAwesome5 name="user-friends" size={14} color={"white"} />

                    <ParagraphText style={{
                        color: "white",

                        fontSize: 14
                    }}>
                        Followers only
                    </ParagraphText>
                </ActivityMapDetail>
            );
        }

        case "UNLISTED": {
            return (
                <ActivityMapDetail>
                    <FontAwesome5 name="eye-slash" size={14} color={"white"} />

                    <ParagraphText style={{
                        color: "white",

                        fontSize: 14
                    }}>
                        Unlisted
                    </ParagraphText>
                </ActivityMapDetail>
            );
        }

        default:
            return null;
    }
};

function getActivityBikeDetail(bike?: GetActivityResponse["activity"]["bike"]) {
    if(!bike || !bike.model)
        return null;

    const bikeType = BikeTypes.find((bikeType) => bikeType.type == bike.model);

    if(!bikeType)
        return null;

    return (
        <ActivityMapDetail>
            <View style={{
                height: 14,
                width: 24,

                flexDirection: "row",
                alignItems: "flex-start"
            }}>
                <Image style={{ height: 14, flex: 1, resizeMode: "contain", tintColor: "white" }} source={bikeType.image}/>
            </View>

            <ParagraphText style={{
                color: "white",

                fontSize: 14
            }}>
                {bikeType.name}
            </ParagraphText>
        </ActivityMapDetail>
    )
}

export default function ActivityMapDetails({ activity }: ActivityMapDetailsProps) {
    const userData = useUser();

    return (
        <View style={{
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",

            flexDirection: "row",
            gap: 10,

            padding: 10
        }}>
            {getActivityVisibilityDetail(activity.visibility)}

            {(!userData.hideBikeModelsInFeed) && getActivityBikeDetail(activity.bike)}
        </View>
    )
};
