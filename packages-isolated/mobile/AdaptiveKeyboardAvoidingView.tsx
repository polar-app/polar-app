import React from 'react';
import {Platform, View} from "react-native";
import {useKeyboard} from "@react-native-community/hooks";

interface IProps {
    readonly children: JSX.Element;
}

export const AdaptiveKeyboardAvoidingView = (props: IProps) => {
    if (Platform.OS === 'ios') {
        const keyboard = useKeyboard();
        const keyboardHeight = keyboard.keyboardShown ? keyboard.keyboardHeight : 0;
        return <View style={{paddingBottom: keyboardHeight, height: '100%'}}>
            {props.children}
        </View>;
    }
    return props.children;
}

