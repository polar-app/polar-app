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
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {InAppLiteServer} from './InAppLiteServer';
import {IapTest} from './IapTest';

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                <View style={{flex: 1}}>
                    <InAppLiteServer/>
                </View>
                <View style={{height: "auto"}}>
                    <IapTest/>
                </View>
            </View>
        </SafeAreaView>
    );
};
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: '#922f2f',
    },
});
