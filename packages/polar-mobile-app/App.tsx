import React from 'react';
import {Alert, Linking, StyleSheet, View} from 'react-native';
import {InAppLiteServer} from './InAppLiteServer/InAppLiteServer';
import {Billing} from "./Billing/Billing";
import {EmailTempStorage} from "./util/EmailTempStorage";
import {AdaptiveSafeAreaView} from "./AdaptiveSafeAreaView";

const App = () => {
    const billing = new Billing();

    // @TODO useEffect
    billing.init().then(() => {
        console.log('Billing initialized');
    });

    return (
        <AdaptiveSafeAreaView>
            <View style={styles.container}>
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
        </AdaptiveSafeAreaView>
    );
};
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
