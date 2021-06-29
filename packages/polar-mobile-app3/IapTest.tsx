import * as RNIap from 'react-native-iap';
import {Platform, Text, FlatList, StyleSheet, View, EmitterSubscription} from 'react-native';
import {
    InAppPurchase,
    Product,
    ProductPurchase, PurchaseError,
    purchaseErrorListener,
    purchaseUpdatedListener,
    SubscriptionPurchase
} from 'react-native-iap';
import React, {Component} from 'react';

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

export class IapTest extends Component<any,
    {
        products: Product[];
    }> {

    purchaseUpdateSubscription: EmitterSubscription | null = null
    purchaseErrorSubscription: EmitterSubscription | null = null

    componentDidMount() {
        const productIds = Platform.select({
            ios: ['plan_plus'],
            android: ['com.example.coins100'],
        });

        RNIap.getProducts(productIds!)
            .then(products => {
                this.setState({products});
                console.log(products);
            })
            .catch(reason => {
                console.warn(reason.code);
                console.warn(reason.message);
            });

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
        });
    }

    render() {
        return (
            <View>
                <Text style={styles.text}>Products available for purchase:</Text>
                <FlatList
                    data={this.state && this.state.products ? this.state.products : []}
                    keyExtractor={item => item.productId}
                    renderItem={({item}) => (
                        <Text
                            style={styles.item}
                            onPress={async () => {
                                try {
                                    await RNIap.requestPurchase(item.productId, false);
                                    // @TODO attach listeners for new purchase
                                } catch (err) {
                                    console.warn(err.code, err.message);
                                }
                            }}>
                            {'- ' + item.title + ' - ' + item.price + ' ' + item.currency}
                        </Text>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    text: {
        fontSize: 22,
        color: '#fff',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: '#FFF',
    },
});
