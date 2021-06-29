import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import {StyleSheet, Text} from 'react-native';
import WebView from 'react-native-webview';
// @ts-ignore
import StaticServer from 'react-native-static-server';

export class InAppLiteServer extends Component<any,
    {
        isRunning: boolean;
        url: string;
    }> {
    private readonly server: StaticServer;

    constructor(props: any) {
        super(props);
        let path = RNFS.MainBundlePath + '/static';
        this.server = new StaticServer(8080, path);
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
        return (
            <WebView
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
            />
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: '#922f2f',
    },
});
