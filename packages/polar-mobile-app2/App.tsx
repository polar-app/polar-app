import React, {Component} from 'react';
import {Alert, Button, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import WebView from "react-native-webview";
import {requestTrackingPermissionsAsync} from "expo-tracking-transparency";
import {Product} from 'react-native-iap';
import * as RNIap from 'react-native-iap';
import {requestPurchase, requestSubscription, useIAP} from 'react-native-iap';

interface State {
    trackingEnabled?: boolean,
    products: Product[],
}

/**
 * @see https://react-native-iap.dooboolab.com/docs/usage_instructions/retrieve_available
 */
// const productIds = Platform.select({
//     ios: [
//         'plan_plus'
//     ],
//     android: [
//         'test'
//     ]
// });

class MainApp extends Component<any, State> {

    _isMounted = false;

    constructor(props: any) {
        super(props);
        this.state = {
            trackingEnabled: undefined,
            products: [],
        };
    }

    async componentDidMount() {
        this._isMounted = true;

        requestTrackingPermissionsAsync().then((trackingEnabled: { granted: any; }) => {
            if (!this._isMounted) {
                // If Component died while the user interacted with the privacy dialog - ignore his response
                return;
            }
            this.setState({
                trackingEnabled: trackingEnabled.granted,
            })
        });

        /**
         * @see https://react-native-iap.dooboolab.com/docs/usage_instructions/retrieve_available
         */
        try {
            await RNIap.initConnection();
            const productIds = Platform.select({
                ios: [
                    'merchant.io.getpolarized.polar'
                ],
                android: [
                    'com.example.coins100'
                ]
            });
            // const products: Product[] = await RNIap.getProducts(productIds!);
            // this.setState({products});
        } catch (err) {
            // console.warn(err.code); // standardized err.code and err.message available
            // console.warn(err.message); // standardized err.code and err.message available
            // console.warn(JSON.stringify(err)); // standardized err.code and err.message available
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        // Don't render any content while the user makes his Privacy choices
        if (this.state.trackingEnabled === undefined) {
            return <></>
        }

        const baseUrl = "https://app.getpolarized.io/" //+"ios/"; // @TODO restore this suffix when it's implemented in the frontend
        const trackingEnabled = this.state.trackingEnabled;

        return (
            <View style={[styles.container, {
                flexDirection: "column"
            }]}>
                <Button
                    title={'Buy a plan TEST'}
                    onPress={() => Alert.alert('Simple Button pressed')}
                />
                <WebView source={{uri: `${baseUrl}?trackingEnabled=${trackingEnabled}`}}
                         userAgent={getUserAgent()}/>
            </View>
        )
    }
}

export default function App() {
    return (
        <SafeAreaView>
            <MainApp/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%",
    },
});

//google blocks oath via WebView, this hides the fact that
// the app runs in web view.
function getUserAgent() {
    //
    // let userAgent = UserAgent.getUserAgent();
    // userAgent = userAgent.replace("wv", "");
    //
    // return userAgent;

    return "Mozilla/5.0 (Linux; Android 9; Android SDK built for x86_64 Build/PSR1.180720.075) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36";
}
