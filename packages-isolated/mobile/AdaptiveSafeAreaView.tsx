import React from 'react';
import {Platform, View, SafeAreaView, StatusBar, StyleSheet} from "react-native";
import DeviceInfo from "react-native-device-info";

const hasNotch = DeviceInfo.hasNotch();

interface IProps {
    readonly children: JSX.Element;
}

export const AdaptiveSafeAreaView = (props: IProps) => {

    if (Platform.OS === 'ios') {
        return (
            <SafeAreaView style={styles.ios}>
                {props.children}
            </SafeAreaView>
        );
    }

    if (Platform.OS === 'android') {
        return (
            <View style={styles.android}>
                {props.children}
            </View>
        );
    }

    return (
        <View style={styles.other}>
            {props.children}
        </View>
    )

}

const styles = StyleSheet.create({
    ios: {
        flex: 1,
        backgroundColor: '#303030',
    },
    android: {
        flex: 1,
        backgroundColor: '#303030',
        paddingTop: hasNotch ? StatusBar.currentHeight : 0,
    },
    other: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});
