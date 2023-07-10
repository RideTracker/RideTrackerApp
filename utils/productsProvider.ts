import * as InAppPurchases from "expo-in-app-purchases";
import Constants from "expo-constants";

let mockConnection: boolean = false;

const mockProducts: InAppPurchases.IAPItemDetails[] = [
    {
        description: "Monthly billed subscription",
        price: "20 SEK",
        priceAmountMicros: 20000000,
        priceCurrencyCode: "SEK",
        productId: "subscription-monthly",
        subscriptionPeriod: "P1M",
        title: "Subscription",
        type: InAppPurchases.IAPItemType.SUBSCRIPTION
    },
    
    {
        description: "Quartely billed subscription",
        price: "60 SEK",
        priceAmountMicros: 60000000,
        priceCurrencyCode: "SEK",
        productId: "subscription-quartely",
        subscriptionPeriod: "P3M",
        title: "Subscription",
        type: InAppPurchases.IAPItemType.SUBSCRIPTION
    },
    
    {
        description: "Quartely billed subscription",
        price: "48 SEK",
        priceAmountMicros: 48000000,
        priceCurrencyCode: "SEK",
        productId: "subscription-quartely-deal",
        subscriptionPeriod: "P3M",
        title: "Subscription",
        type: InAppPurchases.IAPItemType.SUBSCRIPTION
    }
];

export function connect(): Promise<void> {
    if(Constants.expoConfig.extra.environment === "dev") {
        mockConnection = true;
        
        return new Promise((resolve) => resolve());
    }

    return InAppPurchases.connectAsync();
};

export function getProducts(products: string[]): Promise<InAppPurchases.IAPQueryResponse<InAppPurchases.IAPItemDetails>> {
    if(Constants.expoConfig.extra.environment === "dev") {
        return new Promise((resolve, reject) => {
            if(!mockConnection)
                return reject({ code: InAppPurchases.IAPErrorCode.SERVICE_DISCONNECTED });

            resolve({
                errorCode: undefined,
                responseCode: InAppPurchases.IAPResponseCode.OK,
                results: mockProducts.filter((mockProduct) => products.includes(mockProduct.productId))
            });
        });
    }

    return InAppPurchases.getProductsAsync(products);
};
