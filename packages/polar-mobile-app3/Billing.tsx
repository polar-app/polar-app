import * as RNIap from "react-native-iap";
import {Alert, Platform} from "react-native";

export class Billing {
    private connected = false;

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
