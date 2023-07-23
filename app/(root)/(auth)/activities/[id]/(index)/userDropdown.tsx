import { useTheme } from "../../../../../../utils/themes";
import DropdownPage from "../../../../../../components/DropdownPage";
import { FontAwesome5 } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from "react";
import { useNavigation, useRouter, useSearchParams } from "expo-router";
import { Alert, Share } from "react-native";
import { deleteActivity } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../../../modules/useClient";

export default function ActivityUserDropdownPage() {
    const theme = useTheme();
    const { id } = useSearchParams();
    const client = useClient();
    const router = useRouter();

    return (<DropdownPage items={[
        {
            text: "Edit my activity",
            icon: (<FontAwesome5 name="edit" size={22} color={theme.color}/>),

            onPress: () => {
                router.back();

                router.push(`/activities/${id}/edit`);
            }
        },

        {
            text: "Delete my activity",
            type: "danger",
            icon: (<FontAwesome5 name="trash" size={22} color={theme.red}/>),

            onPress: () => {
                Alert.alert("Are you sure?", "Are you sure you wish to delete your activity? This action is destructive, you cannot undo this!\n\nYou can choose to change the visibility to unlisted or private instead of deleting.", [
                    {
                        isPreferred: true,
                        style: "cancel",
                        text: "Cancel"
                    },

                    {
                        style: "destructive",
                        text: "I am sure",
                        onPress: () => {
                            deleteActivity(client, id as string).then((result) => {
                                if(result.success) {
                                    router.replace("/feed");
                                }
                            });
                        }
                    }
                ]);
            }
        }
    ]}/>)
};
