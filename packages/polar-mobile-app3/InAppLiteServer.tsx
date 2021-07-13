import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import WebView from 'react-native-webview';
// @ts-ignore
import StaticServer from 'react-native-static-server';

interface Props {
    // Callback invoked when user wants to buy a plan
    onBuy: (planName: "plus" | "pro") => void;
}

export class InAppLiteServer extends Component<Props, {
    isRunning: boolean;
    url: string;

}> {
    private readonly server: StaticServer;
    webview: WebView<{}> | undefined = undefined;

    constructor(props: any) {
        super(props);
        // Switch between the real Polar Bookshelf /dist and a dummy frontend by using one variable or another
        const realFrontendPath = RNFS.MainBundlePath + '/static/polar';
        const dummyFrontendPath = RNFS.MainBundlePath + '/static/dummy-frontend';

        this.server = new StaticServer(8050, realFrontendPath);
        this.state = {
            isRunning: false,
            url: '',
        };
    }

    componentDidMount() {
        // Start the server
        this.server.start().then((url: string) => {
            console.log('Serving at URL', url);
            this.setState({
                isRunning: true,
                url,
            });
        });
    }

    componentWillUnmount() {
        if (this.server && this.server.isRunning()) {
            this.server.stop();
        }
    }

    render() {
        if (!this.state.isRunning) {
            return <ActivityIndicator size="large"/>
        }
        const runFirst = `
            // Allow the React app to read this and do stuff based on the fact, e.g. show or hide UI elements
            window.isNativeApp = true;
            
            // Propagate all logs from the WebView to the native app through the WebView bridge using postMessage
             const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'action': 'console_log', 'data': {'type': type, 'log': log}}));
              console = {
                  log: (log) => consoleLog('log', log),
                  debug: (log) => consoleLog('debug', log),
                  info: (log) => consoleLog('info', log),
                  warn: (log) => consoleLog('warn', log),
                  error: (log) => consoleLog('error', log),
                };
    
            true; // note: this is required, or you'll sometimes get silent failures
        `;
        return (
            <View style={{height: "100%"}}>
                <Button title={"Reload the WebView"} onPress={() => {
                    alert('Reloading');
                    this.webview?.reload();
                }
                }/>
                <WebView
                    nativeConfig={{props: {webContentsDebuggingEnabled: true}}}
                    ref={(ref) => {
                        // @ts-ignore
                        this.webview = ref;
                    }
                    }
                    originWhitelist={['*']}
                    cacheEnabled={false}
                    javaScriptEnabled={true}
                    scrollEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    source={{
                        // uri: 'https://app.getpolarized.io',
                        uri: this.state.url,
                    }}
                    style={{marginTop: 20}}
                    injectedJavaScriptBeforeContentLoaded={runFirst}
                    onMessage={(event) => {
                        let dataPayload;
                        try {
                            dataPayload = JSON.parse(event.nativeEvent.data);
                        } catch (e) {
                        }

                        if (dataPayload) {
                            if (dataPayload.type === 'Console') {
                                console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
                                return;
                            } else {
                                console.log(dataPayload)

                                const payload: {
                                    action: "console_log" | "buy_play",
                                    data?: {
                                        plan?: "plus" | "pro",
                                    },
                                } = JSON.parse(event.nativeEvent.data);

                                switch (payload.action) {
                                    case "console_log":
                                        break;
                                    case "buy_play":
                                        console.log(payload);
                                        this.props.onBuy(payload.data!.plan!);
                                        break;
                                }


                            }
                        }


                    }}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: '#922f2f',
    },
});
