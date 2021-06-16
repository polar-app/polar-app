import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import WebView from "react-native-webview";
// const UserAgent = require('react-native-user-agent')

export default function App() {
    return (
        <WebView source={{uri: "https://app.getpolarized.io/"}}
                 userAgent={getUserAgent()}
                 style={styles.container}/>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%", height: "100%", marginTop: 20,
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
