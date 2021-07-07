import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import {Button, StyleSheet, Text, View} from 'react-native';
import WebView from 'react-native-webview';
// @ts-ignore
import StaticServer from 'react-native-static-server';

interface Props {
    // Callback invoked when user wants to buy a plan
    onBuy: (planName: string) => void;
}

export class InAppLiteServer extends Component<Props, {
    isRunning: boolean;
    url: string;

}> {
    private readonly server: StaticServer;
    webview: WebView<{}> | undefined = undefined;

    constructor(props: any) {
        super(props);
        let path = RNFS.MainBundlePath + '/static/polar';
        this.server = new StaticServer(9000, path);
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
            return <Text style={styles.text}>Server not running yet</Text>;
        }
        const runFirst = `
            // Allow the React app to read this and do stuff based on the fact, e.g. show or hide UI elements
            window.isNativeApp = true;
            window.onerror = function(message, sourcefile, lineno, colno, error) {
              alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
              return true;
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
                        const payload: {
                            action: string,
                            data: {
                                plan: string,
                            },
                        } = JSON.parse(event.nativeEvent.data);

                        this.props.onBuy(payload.data.plan);

                        // @ts-ignore
                        alert('Initiating purchase of plan: ' + payload.data.plan);
                        console.log(payload);

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
