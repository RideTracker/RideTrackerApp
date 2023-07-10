import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import ModalPage from "../../../../components/ModalPage";
import { CaptionText } from "../../../../components/texts/Caption";
import { ParagraphText } from "../../../../components/texts/Paragraph";
import FormInput from "../../../../components/FormInput";
import { useTheme } from "../../../../utils/themes";
import { FontAwesome } from "@expo/vector-icons";
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
import { connect, getProducts } from "../../../../utils/productsProvider";
import { IAPItemDetails } from "expo-in-app-purchases";

export default function SubscriptionsListPage() {
    const theme = useTheme();
    const router = useRouter();
    const client = useClient();

    const [ products, setProducts ] = useState<IAPItemDetails[]>(null);

    useEffect(() => {
        connect().then(() => {
            getProducts([ "subscription-monthly", "subscription-quartely" ]).then((response) => {
                Alert.alert("Results", JSON.stringify(response, null, 4));

                if(response.results) {
                    setProducts(response.results);
                }
            }).catch((error) => {
                Alert.alert("Error", JSON.stringify(error));
            });
        });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: "Subscriptions" }}/>

            <View style={{
                backgroundColor: theme.brand,

                padding: 10,

                alignItems: "center"
            }}>
                <ParagraphText style={{ color: "white" }}><CaptionText style={{ color: "white" }}>Deal!</CaptionText> Get 3 months for <CaptionText style={{ color: "white" }}>20%</CaptionText> off!</ParagraphText>
            </View>

            <ScrollView>
                <View style={{ gap: 10, padding: 10 }}>
                    {products?.map((product) => (
                        <View key={product.productId}>
                            <CaptionText>{product.title} <ParagraphText>({product.productId})</ParagraphText></CaptionText>
                        
                            <ParagraphText>{product.description}</ParagraphText>

                            <CaptionText>{product.price} / {product.subscriptionPeriod}</CaptionText>
                        </View>
                    ))}

                    <ParagraphText>Manage your subscription on Google Play.</ParagraphText>

                    <Button primary={false} label="Google Play Subscriptions" onPress={() => {
                        Linking.openURL("https://play.google.com/store/account/subscriptions");
                    }}/>
                </View>
            </ScrollView>
        </View>
    );
};
