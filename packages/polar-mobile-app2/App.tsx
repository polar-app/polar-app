import React, {Component} from 'react';
import {Alert, Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import WebView from "react-native-webview";
import {requestTrackingPermissionsAsync} from "expo-tracking-transparency";

interface State {
    trackingEnabled?: boolean,
}

class MainApp extends Component<any, State> {

    _isMounted = false;

    constructor(props: any) {
        super(props);
        this.state = {
            trackingEnabled: undefined,
        };
    }

    componentDidMount() {
        this._isMounted = true;

        requestTrackingPermissionsAsync().then((trackingEnabled) => {
            if (!this._isMounted) {
                // If Component died while the user interacted with the privacy dialog - ignore his response
                return;
            }
            this.setState({
                trackingEnabled: trackingEnabled.granted,
            })
        });
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
