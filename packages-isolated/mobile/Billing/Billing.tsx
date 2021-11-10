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

        try {
            if (Platform.OS === 'ios') {
                await RNIap.clearTransactionIOS()
            }
        } catch (e) {
            console.error(e);
        }
        try {
            if (Platform.OS === 'android') {
                console.log('Flushing all cached Android transactions');
                await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
            }
        } catch (e) {
            console.error(e);
        }

        this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener((purchase: RNIap.InAppPurchase | RNIap.SubscriptionPurchase | RNIap.ProductPurchase) => {
            console.log(new Date().toISOString());
            console.log('purchaseUpdatedListener', purchase);
            this.handlePurchase(purchase)
                .then()
                .catch(reason => {
                    Alert.alert(reason);
                })
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

    private async handlePurchase(purchase: RNIap.InAppPurchase | RNIap.SubscriptionPurchase | RNIap.ProductPurchase) {
        const receipt = purchase.transactionReceipt;
        console.log('receipt', receipt);

        if (!receipt) {
            return;
        }

        const buyerEmail = await AsyncStorage.getItem(
            '@polar:buyer_email',
        );

        if (!buyerEmail) {
            console.error("Can not retrieve previously stored email to finish the purchase procedure");
            return;
        }

        const serverVerifyReceiptResponse = await BackendService.validateReceiptOnServer(purchase.transactionReceipt, buyerEmail!, Platform.OS);

        console.log('deliveryResult');
        console.log(serverVerifyReceiptResponse);

        if (!isSuccess(serverVerifyReceiptResponse)) {
            console.error('Transaction receipt not valid. Can not finish transaction');
            alert('Transaction receipt not valid. Can not finish transaction');
            // Retry / conclude the purchase is fraudulent, etc...
        }

        console.log('Finishing transaction with App Store');

        // Tell the store that you have delivered what has been paid for.
        // Failure to do this will result in the purchase being refunded on Android and
        // the purchase event will reappear on every relaunch of the app until you succeed
        // in doing the below. It will also be impossible for the user to purchase consumables
        // again until you do this.
        try {
            if (Platform.OS === 'android' && !purchase.isAcknowledgedAndroid && purchase.purchaseToken) {
                const ack = await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                console.log('Acknowledged a purchase for the first time in Android', ack);
                return;
            }
            const finishResult = await RNIap.finishTransaction(purchase, true);
            console.log('finishResult', finishResult);
        } catch (e) {
            console.error(e);
            alert('Failed to finish transaction on App Store');
        }
    }

    async getProducts(names: {
        ios: string[],
        android: string[],
    }) {
        await this.init();

        const productIds = Platform.select({
            ios: names.ios,
            android: names.android,
        });

        return await RNIap.getSubscriptions(productIds!);
    }

    async requestPurchase(productId: string) {
        try {
            await RNIap.requestSubscription(productId, false);
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
            android: ['subscription_plan_' + planName],
        });

        // Get the Product object that matches this codename
        if (Platform.OS === 'android') {
            return products.find((product) => product.productId === 'subscription_plan_' + planName);
        }
        return products.find((product) => product.productId === 'plan_' + planName);
    }
}
