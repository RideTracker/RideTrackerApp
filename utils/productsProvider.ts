import { IAPQueryResponse, IAPItemDetails, getProductsAsync, IAPItemType, IAPResponseCode } from "expo-in-app-purchases";
import Constants from "expo-constants";

const mockProducts: IAPItemDetails[] = [
    {
        description: "Monthly billed subscription",
        price: "20 SEK",
        priceAmountMicros: 20000000,
        priceCurrencyCode: "SEK",
        productId: "subscription-monthly",
        subscriptionPeriod: "P1M",
        title: "Subscription",
        type: IAPItemType.SUBSCRIPTION
    },
    
    {
        description: "Quartely billed subscription",
        price: "60 SEK",
        priceAmountMicros: 60000000,
        priceCurrencyCode: "SEK",
        productId: "subscription-quartely",
        subscriptionPeriod: "P3M",
        title: "Subscription",
        type: IAPItemType.SUBSCRIPTION
    },
    
    {
        description: "Quartely billed subscription",
        price: "48 SEK",
        priceAmountMicros: 48000000,
        priceCurrencyCode: "SEK",
        productId: "subscription-quartely",
        subscriptionPeriod: "P3M",
        title: "Subscription",
        type: IAPItemType.SUBSCRIPTION
    }
];

export function getProducts(products: string[]): Promise<IAPQueryResponse<IAPItemDetails>> {
    if(Constants.expoConfig.extra.environment === "dev") {
        return new Promise((resolve) => {
            resolve({
                errorCode: undefined,
                responseCode: IAPResponseCode.OK,
                results: mockProducts.filter((mockProduct) => products.includes(mockProduct.productId))
            });
        });
    }

    return getProductsAsync(products);

};
