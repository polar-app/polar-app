/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {Alert, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {InAppLiteServer} from './InAppLiteServer';
import {IapTest} from './IapTest';
import * as RNIap from "react-native-iap";
import {Billing} from "./Billing";

const App = () => {
    const billing = new Billing();
    billing.init().then(r => {
    });

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                <View style={{flex: 1}}>
                    <InAppLiteServer
                        onBuy={async (planName) => {
                            const products = await billing.getProducts({ios: ['plan_' + planName]});

                            // Get first product that matches this codename
                            const product = products.find(() => true);

                            if (!product) {
                                Alert.alert("Can not find a configured Apple product for the selected plan: " + planName);
                                return;
                            }

                            try {
                                await billing.requestPurchase(product.productId);
                                // @TODO attach listeners for new purchase, just like I did it experimentally in IapTest.tsx
                            } catch (err) {
                                Alert.alert(err.code, err.message);
                            }
                        }}/>
                </View>
                <View style={{height: "auto"}}>
                    <IapTest/>
                </View>
            </View>
        </SafeAreaView>
    );
};
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: '#922f2f',
    },
});
