import * as RNIap from "react-native-iap";
import {Alert, EmitterSubscription, Platform} from "react-native";
import {
    InAppPurchase,
    ProductPurchase, PurchaseError,
    purchaseErrorListener,
    purchaseUpdatedListener,
    SubscriptionPurchase
} from "react-native-iap";

// @TODO Move to own file
class PolarBackendService {
    static validateReceiptOnServer(transactionReceipt: string) {
        console.log(transactionReceipt);
        return new Promise(resolve => {
            resolve(true);
        });
    }
}

function isSuccess(serverResponse: unknown) {
    return true;
}

export class Billing {
    private connected = false;

    purchaseUpdateSubscription: EmitterSubscription | null = null
    purchaseErrorSubscription: EmitterSubscription | null = null

    constructor() {
    }

    async init() {
        if (this.connected) {
            return;
        }
        const connected = await RNIap.initConnection();
        if (!connected) {
            Alert.alert("Can not make in app purchases");
            return;
        }
        this.connected = true;

        await RNIap.clearTransactionIOS()

        this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase: InAppPurchase | SubscriptionPurchase | ProductPurchase) => {
            console.log('purchaseUpdatedListener', purchase);
            const receipt = purchase.transactionReceipt;
            console.log('receipt', receipt);
            if (receipt) {
                PolarBackendService.validateReceiptOnServer(purchase.transactionReceipt)
                    .then(async (deliveryResult) => {
                        if (isSuccess(deliveryResult)) {
                            // Tell the store that you have delivered what has been paid for.
                            // Failure to do this will result in the purchase being refunded on Android and
                            // the purchase event will reappear on every relaunch of the app until you succeed
                            // in doing the below. It will also be impossible for the user to purchase consumables
                            // again until you do this.


                            try {
                                await RNIap.finishTransaction(purchase, true);
                                // If not consumable
                                await RNIap.finishTransaction(purchase, false);
                            } catch (e) {
                                console.error(e);
                            }
                        } else {
                            // Retry / conclude the purchase is fraudulent, etc...
                        }
                    });
            }
        });

        this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
            console.warn('purchaseErrorListener', error);
            switch (error.code) {
                case "E_USER_CANCELLED":
                    Alert.alert("Purchase cancelled. Please try again");
                    break;
                default:
                    Alert.alert(String(error.code), error.message);
                    break;
            }
        });
    }

    async getProducts(names: {
        ios: string[],
        android?: string[],
    }) {
        await this.init();

        const productIds = Platform.select({
            ios: names.ios,
            android: names.android ? names.android : [], // @TODO
        });

        return await RNIap.getProducts(productIds!);
    }

    async requestPurchase(productId: string) {
        try {
            await RNIap.requestPurchase(productId, false);
            // @TODO attach listeners for new purchase, just like I did it experimentally in IapTest.tsx
        } catch (err) {
            Alert.alert(err.code, err.message);
        }
    }

    public static async getPurchasedProductIds(): Promise<string[]> {
        console.log('Attempting to get purchases');
        const history = await RNIap.getPurchaseHistory();
        const purchasedProductIds: string[] = [];
        Alert.alert('Previous purchases count', history.length.toString(10));
        for (let historyElement of history) {
            purchasedProductIds.push(historyElement.productId);
        }

        function onlyUnique(value: any, index: any, self: string | any[]) {
            return self.indexOf(value) === index;
        }

        return purchasedProductIds.filter(onlyUnique);
    }
}
