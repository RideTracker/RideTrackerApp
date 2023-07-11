import { ReactNode, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import ModalPage from "../../../../components/ModalPage";
import { CaptionText } from "../../../../components/texts/Caption";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import FormInput from "../../../../components/FormInput";
import { useTheme } from "../../../../utils/themes";
import { FontAwesome5 } from "@expo/vector-icons";
import CategorySelector, { CategorySelectorItem } from "../../../../components/CategorySelector";
import * as ImagePicker from "expo-image-picker";
import Button from "../../../../components/Button";
import { HeaderText } from "../../../../components/texts/Header";
import { Stack, useRouter } from "expo-router";
import uuid from "react-native-uuid";
import { createBike } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../modules/useClient";
import PageOverlay from "../../../../components/PageOverlay";
import * as Linking from "expo-linking";
import { connect, getProducts, purchaseProduct } from "../../../../utils/productsProvider";
import { IAPItemDetails } from "expo-in-app-purchases";
import FormDivider from "../../../../components/FormDivider";
import { SmallText } from "../../../../components/texts/Small";

const features: {
    key: string;
    icon: (theme: any) => ReactNode;
    description: string;
}[] = [
    {
        key: "routes",
        description: "Create directions-ready routes with waypoints, shapes, or drawings!",
        icon: (theme) => (<FontAwesome5 name="route" color={theme.brand} size={40}/>)
    },

    {
        key: "stats",
        description: "Get meaningful insights of your activities that you can export in various formats!",
        icon: (theme) => (<FontAwesome5 name="chart-area" color={theme.brand} size={40}/>)
    },

    {
        key: "bike_stats",
        description: "Get meaningful insights of your efforts on different bikes!",
        icon: (theme) => (<FontAwesome5 name="bicycle" color={theme.brand} size={40}/>)
    }
];

export default function SubscriptionsListPage() {
    const theme = useTheme();
    const router = useRouter();
    const client = useClient();

    const [ connected, setConnected ] = useState<boolean>(false);
    const [ products, setProducts ] = useState<{ [ key: string ]: IAPItemDetails }>(null);

    useEffect(() => {
        connect().then(() => {
            getProducts([ "subscription", "subscription-monthly", "subscription-quartely", "subscription-quartely-deal", "subscription-quartely-trial" ]).then((response) => {
                Alert.alert("Results", JSON.stringify(response, null, 4));

                if(response.results) {
                    const results: {
                        [ key: string ]: IAPItemDetails
                    } = {};

                    response.results.forEach((result) => results[result.productId] = result);

                    setProducts(results);
                }
            }).catch((error) => {
                Alert.alert("Error", JSON.stringify(error));
            });
        });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Subscriptions",

                headerRight: () => (
                    <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={() => router.back()}>
                        <ParagraphText style={{ fontSize: 18 }}>Close</ParagraphText>
                    </TouchableOpacity>
                )
            }}/>

            <View style={{
                backgroundColor: theme.brand,

                padding: 10,

                alignItems: "center"
            }}>
                <ParagraphText style={{ color: "white" }}><CaptionText style={{ color: "white" }}>Deal!</CaptionText> Get 3 months for <CaptionText style={{ color: "white" }}>20%</CaptionText> off!</ParagraphText>
            </View>

            <ScrollView>
                <View style={{ gap: 10, padding: 10 }}>
                    <HeaderText style={{
                        textAlign: "center",
                        fontWeight: "normal",
                        paddingHorizontal: 10
                    }}>
                        Unlock many explorative features with a subscription
                    </HeaderText>

                    {features.map((feature) => (
                        <View key={feature.key} style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center"
                        }}>
                            <View style={{
                                width: 64,
                                height: 64,

                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {feature.icon(theme)}
                            </View>

                            <ParagraphText style={{ paddingRight: 64 + 10 }}>{feature.description}</ParagraphText>
                        </View>
                    ))}

                    {(products?.subscription) && (
                        <View style={{
                            borderRadius: 4,
                            borderTopWidth: 4,
                            borderTopColor: theme.brand,

                            backgroundColor: "rgba(128, 128, 128, .05)",

                            padding: 10
                        }}>
                            <CaptionText style={{ color: theme.brand }}>Subscription</CaptionText>
                            <ParagraphText>Includes all above features</ParagraphText>

                            <FormDivider/>

                            <CaptionText>Starts at {(products?.subscription)?(products.subscription.price):("...")} per month</CaptionText>
                            <ParagraphText>Subscriptions are non-refundable</ParagraphText>

                            <FormDivider/>

                            <Button primary={true} label="Subscribe" onPress={() => {
                                purchaseProduct("subscription");
                            }}/>
                        </View>
                    )}

                    <Button primary={false} label="Subscribe quartely" onPress={() => {
                        purchaseProduct("subscription-quartely");
                    }}/>
                </View>
            </ScrollView>
        </View>
    );
};
