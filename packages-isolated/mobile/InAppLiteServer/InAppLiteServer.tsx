import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import {ActivityIndicator, BackHandler, Linking, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
// @ts-ignore
import StaticServer from 'react-native-static-server';
import injectedJavaScriptBeforeContentLoaded from "./util/injectedJavaScriptBeforeContentLoaded";
import tryParseWebviewPostMessage from "./util/tryParseWebviewPostMessage";

const useEmbeddedServer = false;

export class InAppLiteServer extends Component<Props, State> {

    // Reference to the HTTP Server
    private readonly server: StaticServer;

    // A reference to the WebView component, populated after first render
    webview: WebView | undefined = undefined;

    constructor(props: any) {
        super(props);

        // Initial state
        this.state = {
            isRunning: !useEmbeddedServer,
            url: !useEmbeddedServer ? 'https://app.getpolarized.io' : '',
        };

        if (useEmbeddedServer) {
            // Easily switch between the real Polar Bookshelf /dist and a dummy frontend by using one variable or another
            const realFrontendPath = '/static/polar';
            // const dummyFrontendPath = '/static/dummy-frontend';
            this.server = new StaticServer(8050, RNFS.MainBundlePath + realFrontendPath, {localOnly: true});
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            const js = `window.postMessage({type: "android-go-back"});`;
            this.webview?.injectJavaScript(js);
            return true;
        });

        if (!useEmbeddedServer) {
            return;
        }
        // Start the HTTP server within the mobile app
        this.server.start().then((url: string) => {
            console.log('Serving at URL', url);

            // When the server is actually started, set the URL within the state
            this.setState({
                isRunning: true,
                url,
            });
        }).catch((err: Error) => {
            alert(err);
        })
    }

    render() {
        if (!this.state.isRunning) {
            // Show a spinner while the HTTP server is starting
            return <View style={styles.spinnerWrapper}>
                <ActivityIndicator size="large" style={styles.spinner}/>
            </View>
        }

        return <WebView
            nativeConfig={{props: {webContentsDebuggingEnabled: true}}}
            ref={(ref: any) => {
                if (ref) {
                    this.webview = ref;
                }
            }}
            // Allow any URL to be loaded within the WebView
            originWhitelist={['*']}

            // Enable JS
            javaScriptEnabled={true}

            // Scrollable viewport
            scrollEnabled={true}

            // Enable Analytics cookies and such
            thirdPartyCookiesEnabled={true}

            source={{uri: this.state.url}}

            style={styles.webview}

            // Inject JS within the web app
            injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded()}

            // Listener for window.ReactNativeWebView.postMessage() calls from the JS code
            // of the embedded web app
            onMessage={(event) => {
                const dataPayload = tryParseWebviewPostMessage(event);

                console.log('dataPayload', dataPayload);

                if (!dataPayload) {
                    console.error(JSON.stringify(event, null, 2));
                    throw Error('Failed to parse payload from JS bridge. Check the logs');
                }

                switch (dataPayload.action) {
                    case "console_log":
                        console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
                        break;
                    case "buy_play":
                        // Buying a plan
                        this.props.onBuy(dataPayload.data!.plan!, dataPayload.data!.email!);
                        break;
                    case "android-go-back-exhausted":
                        BackHandler.exitApp();
                        break;
                    default:
                        throw Error('Switch case not implemented: ' + JSON.stringify(dataPayload));
                }
            }}
            onNavigationStateChange={(event) => {
                if (InAppLiteServer.isExternalUrl(event.url)) {
                    this.webview?.stopLoading();
                    Linking.openURL(event.url)
                        .then()
                        .catch(reason => {
                            console.error(reason);
                            alert('Failed to open a URL in external browser');
                        })
                }
            }}
        />;
    }

    private static isExternalUrl(url: string) {
        return !url.includes('app.getpolarized.io');
    }

    componentWillUnmount() {
        if (!useEmbeddedServer) {
            return;
        }
        // Destroy the HTTP server when the component is no longer visible
        if (this.server && this.server.isRunning()) {
            this.server.stop();
        }
    }
}

interface Props {
    // Callback invoked when user wants to buy a plan
    onBuy: (planName: "plus" | "pro" | "free", email: string) => void;
}

interface State {
    // Set to true when the HTTP server within the app is running
    isRunning: boolean;

    // The URL where the server is accessible
    url: string;
}

const styles = StyleSheet.create({
    spinnerWrapper: {
        flex: 1,
        alignItems: "center"
    },
    spinner: {
        flex: 1,
    },
    webview: {
        height: "100%",
    },
});
