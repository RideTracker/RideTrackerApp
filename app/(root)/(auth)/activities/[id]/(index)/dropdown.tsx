import { useTheme } from "../../../../../../utils/themes";
import DropdownPage from "../../../../../../components/DropdownPage";
import { FontAwesome5 } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from "react";
import { useSearchParams } from "expo-router";
import { Share } from "react-native";

export default function ActivityDropdownPage() {
    const theme = useTheme();
    const { id } = useSearchParams();

    return (<DropdownPage items={[
        {
            text: "Share activity",
            icon: (<FontAwesome5 name="share-square" size={22} color={theme.color}/>),

            onPress: () => {
                Share.share({
                    title: "View this activity on the RideTracker platform!",
                    message: `https://ridetracker.app/activities/${id}`
                }, {
                    dialogTitle: "Share activity link to others!"
                });
            }
        }
    ]}/>)
};
