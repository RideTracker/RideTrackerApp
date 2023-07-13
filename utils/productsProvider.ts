import * as InAppPurchases from "expo-in-app-purchases";
import Constants from "expo-constants";

let mockConnection: boolean = false;

let mockListener: (callback: (InAppPurchases.IAPQueryResponse<InAppPurchases.InAppPurchase>)) => void = null;

const mockProducts: InAppPurchases.IAPItemDetails[] = [
    {
        priceAmountMicros: 25000000,
        title: "Monthly Subscription (com.norasoderlund.ridetrackerapp (unreviewed))",
        productId: "subscription_monthly",
        type: 1,
        priceCurrencyCode: "SEK",
        description: "",
        price: "25,00 kr",
        subscriptionPeriod: "P1M"
    },
    {
        priceAmountMicros: 60000000,
        title: "Quartely Subscription (com.norasoderlund.ridetrackerapp (unreviewed))",
        productId: "subscription_quartely",
        type: 1,
        priceCurrencyCode: "SEK",
        description: "",
        price: "60,00 kr",
        subscriptionPeriod: "P3M"
    }
];

export function connect(): Promise<void> {
    if(Constants.expoConfig.extra.environment === "dev") {
        mockConnection = true;
        
        return new Promise((resolve) => resolve());
    }

    return InAppPurchases.connectAsync();
};

export function disconnect(): Promise<void> {
    if(Constants.expoConfig.extra.environment === "dev") {
        mockConnection = false;
        
        return new Promise((resolve) => resolve());
    }

    return InAppPurchases.disconnectAsync();
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

export function setProductListener(callback: (result: InAppPurchases.IAPQueryResponse<InAppPurchases.InAppPurchase>) => void) {
    if(Constants.expoConfig.extra.environment === "dev") {
        mockListener = callback;

        return;
    }

    return InAppPurchases.setPurchaseListener(callback);
}

export function purchaseProduct(productId: string): Promise<void> {
    if(Constants.expoConfig.extra.environment === "dev") {
        mockListener?.({
            responseCode: InAppPurchases.IAPResponseCode.OK,
            results: [
                {
                    acknowledged: false,
                    orderId: "orderId",
                    packageName: "com.norasoderlund.ridetrackerapp",
                    productId: productId,
                    purchaseState: InAppPurchases.InAppPurchaseState.PURCHASING,
                    purchaseTime: Date.now(),
                    purchaseToken: "token"
                }
            ]
        });

        return;
    }
    
    return InAppPurchases.purchaseItemAsync(productId);
};
