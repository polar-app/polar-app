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
import {Alert, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, View, Text} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {InAppLiteServer} from './InAppLiteServer/InAppLiteServer';
import {Billing} from "./Billing/Billing";
import {EmailTempStorage} from "./util/EmailTempStorage";

const hasNotch = DeviceInfo.hasNotch();

const App = () => {
    const billing = new Billing();

    // @TODO useEffect
    billing.init().then(() => {
        console.log('Billing initialized');
    });

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View
                style={styles.container}>
                <InAppLiteServer
                    onBuy={async (planName, email) => {

                        if (planName === 'free') {
                            // Redirect to Apple subscriptions page so the user can cancel his plan there
                            // @see https://stackoverflow.com/a/27366385
                            Linking.openURL('https://apps.apple.com/account/subscriptions').catch(err => console.error('Error', err));
                            return;
                        }

                        if (!await EmailTempStorage.store(email)) {
                            Alert.alert('Can not store buyer email in local storage. Purchase can not be made because we would not know to which user to link it');
                            return;
                        }

                        const product = await billing.getProductByPlanName(planName);

                        if (!product) {
                            Alert.alert(`Can not find a product with ID=plan_${planName} within the App Store`);
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
    safeAreaView: {
        flex: 1,
        backgroundColor: '#323638',
        paddingTop: Platform.OS === 'android' && hasNotch ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
});
