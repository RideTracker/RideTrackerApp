import * as InAppPurchases from "expo-in-app-purchases";
import Constants from "expo-constants";

let mockConnection: boolean = false;

const mockProducts: InAppPurchases.IAPItemDetails[] = [
    {
        priceAmountMicros: 25000000,
        title: "Subscription (com.norasoderlund.ridetrackerapp (unreviewed))",
        productId: "subscription",
        type: 1,
        priceCurrencyCode: "SEK",
        description: "",
        price: "25,00 kr",
        subscriptionPeriod: "P1M"
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
