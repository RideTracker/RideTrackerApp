import * as InAppPurchases from "expo-in-app-purchases";
import Constants from "expo-constants";
import Client, { createStoreCouponDev } from "@ridetracker/ridetrackerclient";

let mockConnection: boolean = false;

let mockListener: (callback: (InAppPurchases.IAPQueryResponse<InAppPurchases.InAppPurchase>)) => void = null;

const mockProducts: InAppPurchases.IAPItemDetails[] = [
    {
        priceAmountMicros: 31000000,
        title: "Monthly Subscription (com.norasoderlund.ridetrackerapp (unreviewed))",
        productId: "subscription_monthly",
        type: 1,
        priceCurrencyCode: "SEK",
        description: "",
        price: "31,00 kr",
        subscriptionPeriod: "P1M"
    },
    {
        priceAmountMicros: 74000000,
        title: "Quartely Subscription (com.norasoderlund.ridetrackerapp (unreviewed))",
        productId: "subscription_quartely",
        type: 1,
        priceCurrencyCode: "SEK",
        description: "",
        price: "74,00 kr",
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

export function purchaseProduct(productId: string, client?: Client): Promise<void> {
    if(Constants.expoConfig.extra.environment === "dev") {
        if(!client)
            throw new Error("Client must be provided in dev environment.");

        createStoreCouponDev(client, productId).then((result) => {
            if(result.success) {
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
                            purchaseToken: result.coupon.token
                        }
                    ]
                });
            }
        });

        return;
    }
    
    return InAppPurchases.purchaseItemAsync(productId);
};

export function finishTransaction(purchase: InAppPurchases.InAppPurchase, consume: boolean): Promise<void> {
    if(Constants.expoConfig.extra.environment === "dev")
        return new Promise((resolve) => resolve());

    return InAppPurchases.finishTransactionAsync(purchase, consume);
};
