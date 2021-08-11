import * as RNIap from "react-native-iap";
import {Alert, EmitterSubscription, Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BackendService} from "./BackendService";

function isSuccess(serverResponse: boolean) {
    return serverResponse;
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

        this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener((purchase: RNIap.InAppPurchase | RNIap.SubscriptionPurchase | RNIap.ProductPurchase) => {
            console.log(new Date().toISOString());
            console.log('purchaseUpdatedListener', purchase);
            const receipt = purchase.transactionReceipt;
            console.log('receipt', receipt);

            if (!receipt) {
                return;
            }

            AsyncStorage.getItem(
                '@polar:buyer_email',
            ).then(buyerEmail => {
                BackendService.validateReceiptOnServer(purchase.transactionReceipt, buyerEmail!)
                    .then(async (serverVerifyReceiptResponse) => {

                        console.log('deliveryResult');
                        console.log(serverVerifyReceiptResponse);

                        if (isSuccess(serverVerifyReceiptResponse)) {
                            console.log('Finishing transaction with App Store');
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
                            console.error('Transaction receipt not valid. Can not finish transaction');
                            // Retry / conclude the purchase is fraudulent, etc...
                        }
                    });
            });


        });

        this.purchaseErrorSubscription = RNIap.purchaseErrorListener((error: RNIap.PurchaseError) => {
            console.warn('purchaseErrorListener', error);
            if (error.code === "E_USER_CANCELLED") {
                Alert.alert("Purchase cancelled. Please try again");
            } else {
                Alert.alert(String(error.code), error.message);
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

    async getProductByPlanName(planName: string) {
        const products = await this.getProducts({
            ios: ['plan_' + planName],
            android: ['plan_' + planName],
        });

        // Get the Product object that matches this codename
        return products.find((product) => product.productId === 'plan_' + planName);
    }
}
