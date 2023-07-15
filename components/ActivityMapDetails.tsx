import { GetActivityResponse } from "@ridetracker/ridetrackerclient";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { ParagraphText } from "./texts/Paragraph";
import { FontAwesome5 } from "@expo/vector-icons";
import { ActivityMapDetail } from "./ActivityMapDetail";

export type ActivityMapDetailsProps = {
    activity: {
        visibility: GetActivityResponse["activity"]["visibility"];
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
}

export default function ActivityMapDetails({ activity }: ActivityMapDetailsProps) {
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
        </View>
    )
};
