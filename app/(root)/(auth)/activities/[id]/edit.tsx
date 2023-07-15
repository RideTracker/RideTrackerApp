import React, { useState, useEffect } from "react";
import { View, ScrollView, Modal, ActivityIndicator } from "react-native";
import ModalPage from "../../../../../components/ModalPage";
import ActivityEdit, { ActivityEditProperties } from "../../../../../components/ActivityEdit";
import { useRouter, useSearchParams } from "expo-router";
import { getActivityById, getBike, updateActivity } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../../modules/useClient";
import Button from "../../../../../components/Button";
import { useTheme } from "../../../../../utils/themes";

export default function ActivityEditPage() {
    const { id } = useSearchParams();
    const client = useClient();
    const theme = useTheme();
    const router = useRouter();

    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ properties, setProperties ] = useState<ActivityEditProperties>(null);

    useEffect(() => {
        getActivityById(client, id as string).then(async (result) => {
            if(result.success) {
                const bike = (result.activity.bike)?((await getBike(client, result.activity.bike.id)).bike):(null);

                setProperties({
                    visibility: result.activity.visibility,
                    bike,
                    title: result.activity.title,
                    description: result.activity.description
                });
            }
        });
    }, []);

    if(!properties)
        return null;

    return (
        <ModalPage>
            <ScrollView>
                <View style={{
                    gap: 10,
                    padding: 10
                }}>
                    <ActivityEdit properties={properties} onChange={(partialProperties) => {
                        setProperties({
                            ...properties,
                            ...partialProperties
                        });
                    }}/>

                    <Button primary={true} label={(!submitting) && ("Update activity")} onPress={() => {
                        setSubmitting(true);

                        updateActivity(client, id as string, properties.visibility, properties.title, properties.description, properties.bike?.id).then((result) => {
                            setSubmitting(false);

                            if(result.success)
                                router.back();
                        });
                    }}>
                        {(submitting) && (<ActivityIndicator color={theme.background} size={24}/>)}
                    </Button>

                    <Button primary={false} type="danger" label="Cancel"/>
                </View>
            </ScrollView>
        </ModalPage>
    );
};
