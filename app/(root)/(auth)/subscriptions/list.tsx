import React, { ReactNode, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Alert, Platform } from "react-native";
import ModalPage from "../../../../components/ModalPage";
import { CaptionText } from "../../../../components/texts/Caption";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import FormInput from "../../../../components/FormInput";
import { useTheme } from "../../../../utils/themes";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import CategorySelector, { CategorySelectorItem } from "../../../../components/CategorySelector";
import * as ImagePicker from "expo-image-picker";
import Button from "../../../../components/Button";
import { HeaderText } from "../../../../components/texts/Header";
import { Stack, useRouter } from "expo-router";
import uuid from "react-native-uuid";
import { createStoreSubscription, getStoreProducts } from "@ridetracker/ridetrackerclient";
import { useClient } from "../../../../modules/useClient";
import PageOverlay from "../../../../components/PageOverlay";
import * as Linking from "expo-linking";
import { connect, disconnect, finishTransaction, getProducts, purchaseProduct, setProductListener } from "../../../../utils/productsProvider";
import { IAPItemDetails, IAPResponseCode, InAppPurchase } from "expo-in-app-purchases";
import FormDivider from "../../../../components/FormDivider";
import { SmallText } from "../../../../components/texts/Small";
import { LinkText } from "../../../../components/texts/Link";
import Constants from "expo-constants";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../../utils/stores/userData";
import { useUser } from "../../../../modules/user/useUser";

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

const displayedProducts: {
    key: string;
    title: string;
    description: string;
    button: string;
}[] = [
    {
        key: "subscription_monthly",
        title: "Monthly Subscription",
        description: "Includes all above features",
        button: "Subscribe monthly"
    },
    
    {
        key: "subscription_quartely",
        title: "Quartely Subscription",
        description: "Includes all above features",
        button: "Subscribe quartely"
    }
];

let productListener: (purchase: InAppPurchase) => void = null;

setProductListener((result) => {
    if(result.responseCode === IAPResponseCode.OK) {
        result.results?.forEach((purchase) => {
            productListener?.(purchase);
        });
    }
});

export default function SubscriptionsListPage() {
    const theme = useTheme();
    const router = useRouter();
    const client = useClient();
    const userData = useUser();
    const dispatch = useDispatch();

    const [ product, setProduct ] = useState<number>(0);
    const [ products, setProducts ] = useState<{ [ key: string ]: IAPItemDetails }>(null);
    const [ hasProducts, setHasProducts ] = useState<boolean>(true);

    useEffect(() => {
        productListener = (purchase: InAppPurchase) => {
            createStoreSubscription(client, purchase.productId, purchase.purchaseToken).then((result) => {
                if(result.success) {
                    finishTransaction(purchase, false).then(() => {
                        dispatch(setUserData({
                            user: {
                                ...userData.user,
                                subscribed: true
                            }
                        }));

                        router.back();
                        
                        //Alert.alert("subscribed!");
                    });
                }
            });
        };

        return () => {
            productListener = null;
        };
    }, []);

    useEffect(() => {
        getStoreProducts(client).then((result) => {
            if(result.success) {
                setHasProducts(true);

                connect().then(() => {
                    getProducts(result.products).then((response) => {
                        if(response.results) {
                            const results: {
                                [ key: string ]: IAPItemDetails
                            } = {};

                            response.results.forEach((result) => results[result.productId] = result);

                            setProducts(results);
                        }

                        //Alert.alert("Results", JSON.stringify(response, null, 4));
                    }).catch((error) => {
                        setHasProducts(false);

                        disconnect();
                        //Alert.alert("Error", JSON.stringify(error));
                    });
                });
            }
            else
                setHasProducts(false);
        });

        return () => {
            if(hasProducts)
                disconnect();
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: "Subscriptions",

                headerRight: (Platform.OS === "ios")?(() => (
                    <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={() => router.back()}>
                        <ParagraphText style={{ fontSize: 18 }}>Close</ParagraphText>
                    </TouchableOpacity>
                )):(undefined)
            }}/>

            <View style={{
                backgroundColor: theme.brand,

                padding: 10,

                alignItems: "center"
            }}>
                <ParagraphText style={{ color: "white" }}><CaptionText style={{ color: "white" }}>Deal!</CaptionText> Subscribe quartely for <CaptionText style={{ color: "white" }}>20%</CaptionText> off!</ParagraphText>
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

                    <View style={{
                        borderRadius: 4,
                        borderTopWidth: 4,
                        borderTopColor: theme.brand,

                        backgroundColor: "rgba(128, 128, 128, .05)",

                        padding: 10
                    }}>
                        <View style={{
                            flexDirection: "row",
                            gap: 10
                        }}>
                            <View style={{ flexGrow: 1 }}>
                                <CaptionText style={{ color: theme.brand }}>{displayedProducts[product].title}</CaptionText>
                                <ParagraphText>{displayedProducts[product].description}</ParagraphText>
                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",

                                gap: 10
                            }}> 
                                {(displayedProducts.length !== 0 && product !== 0) && (
                                    <TouchableOpacity style={{
                                        height: 40,
                                        width: 40,

                                        justifyContent: "center",
                                        alignItems: "center"
                                    }} onPress={() => setProduct(product - 1)}>
                                        <FontAwesome name="chevron-left" size={24} color={theme.color}/>
                                    </TouchableOpacity>
                                )}
                                
                                {(displayedProducts.length > 1 && product !== displayedProducts.length - 1) && (
                                    <TouchableOpacity style={{
                                        height: 40,
                                        width: 40,

                                        justifyContent: "center",
                                        alignItems: "center"
                                    }} onPress={() => setProduct(product + 1)}>
                                        <FontAwesome name="chevron-right" size={24} color={theme.color}/>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <FormDivider/>

                        {(hasProducts)?(
                            <React.Fragment>
                                <CaptionText placeholder={!products?.[displayedProducts[product].key]}>Starts at {products?.[displayedProducts[product].key]?.price} per {(products?.[displayedProducts[product].key]?.subscriptionPeriod === "P1M")?("month"):("quarter")}</CaptionText>
                                <ParagraphText>Subscriptions are non-refundable</ParagraphText>

                                <FormDivider/>

                                <Button primary={true} label={displayedProducts[product].button} onPress={() => {
                                    purchaseProduct(displayedProducts[product].key, client);
                                }}/>
                            </React.Fragment>
                        ):(
                            <View style={{
                                gap: 10,

                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <FontAwesome5 name="store-slash" size={40} color={"grey"}/>

                                <ParagraphText>Sorry, the store is currently not accessible!</ParagraphText>

                                <ParagraphText>During the public beta period, we're still developing some of the subscription based features, and as such, subscriptions will only be enabled after the beta period.</ParagraphText>
                            </View>
                        )}
                    </View>
                    
                    <SmallText>Rate limit restrictions may come to apply, in such case, you will be prominently informed.</SmallText>
                </View>
            </ScrollView>
        </View>
    );
};
