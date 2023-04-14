import Constants from "expo-constants";
import { Response } from "./response";
import { useSelector } from "react-redux";
import { BikeResponse } from "./bike";

export type ActivityResponse = Response & {
    id: string;

    likes?: boolean;

    summary?: {
        area: string;
        distance: number;
        averageSpeed: number;
        elevation: number;
        maxSpeed: number;
        comments: number;
    },

    user: {
        id: string;
        name: string;
        avatar: string;
    };

    comment?: {
        message: string;
        timestamp: number;

        user: {
            id: string;
            name: string;
            avatar: string;
        }
    };

    bike?: {
        id: string;
        name: string;
        model: string;
        image: string;

        summary?: {
            rides: number;
            distance: number;
            elevation: number;
        };
    };

    timestamp: number;
};

export async function getActivityById(authorization: string, id: string) {
    const url = new URL(`/api/activities/${id}`, Constants.expoConfig.extra.api);

    const response = await fetch(url, {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${authorization}`
        }
    });
    const result = await response.json();

    console.log(result);

    return result;
};
