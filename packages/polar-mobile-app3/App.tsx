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
import {InAppLiteServer} from './InAppLiteServer/InAppLiteServer';
import {Billing} from "./Billing/Billing";
import {EmailTempStorage} from "./util/EmailTempStorage";

const App = () => {
    const billing = new Billing();

    billing.init().then((r) => {
        console.log('Billing initialized');
    });

    return (
        <SafeAreaView style={{flex: 1}}>
            <View
                style={styles.container}>
                <InAppLiteServer
                    onBuy={async (planName, email) => {

                        if (!await EmailTempStorage.store(email)) {
                            Alert.alert('Can not store buyer email in local storage. Purchase can not be made because we would not know to which user to link it');
                            return;
                        }

                        const product = await billing.getProductByPlanName(planName);

                        if (!product) {
                            Alert.alert(`Can not find a product with ID=plan_${planName} within Apple Appstore Connect`);
                            return;
                        }

                        try {
                            await billing.requestPurchase(product.productId);
                            // Callback that handles successful/unsuccessful purchases is attached inside
                            // the Billing utility class. Follow the rest of the logic there. It's invoked
                            // asynchronously by Apple
                        } catch (err) {
                            Alert.alert(err.code, err.message);
                        }
                    }}/>
            </View>
        </SafeAreaView>
    );
};
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
