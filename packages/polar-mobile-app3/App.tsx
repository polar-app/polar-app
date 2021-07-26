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
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import {InAppLiteServer} from './InAppLiteServer';
import {IapTest} from './IapTest';
import {Billing} from "./Billing";
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
    const billing = new Billing();
    billing.init().then((r) => {
    });

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={styles.container}>
                <View style={styles.container}>
                    <InAppLiteServer
                        onBuy={async (planName, email) => {

                            try {
                                await AsyncStorage.setItem(
                                    '@polar:buyer_email',
                                    email
                                );
                            } catch (error) {
                                // Error saving data
                                console.error('Can not store buyer Email');
                                console.error(error);
                            }

                            const products = await billing.getProducts({ios: ['plan_' + planName]});

                            // Get first product that matches this codename
                            const product = products.find(() => true);

                            if (!product) {
                                Alert.alert("Can not find a configured Apple product for the selected plan: " + planName);
                                return;
                            }

                            try {
                                await billing.requestPurchase(product.productId);
                                // Callback for new purchases is attached inside Billing.ts
                                // Rest of procedure follows asynchronously there
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
        flexDirection: 'column',
    },
    text: {
        color: '#922f2f',
    },
});
