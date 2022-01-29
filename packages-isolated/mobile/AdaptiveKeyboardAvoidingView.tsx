import React from 'react';
import {KeyboardAvoidingView, Platform} from "react-native";

interface IProps {
    readonly children: JSX.Element;
}

export const AdaptiveKeyboardAvoidingView = (props: IProps) => {

    if (Platform.OS === 'ios') {

        // iOS is the only platform causing this problem.
        return (
            <KeyboardAvoidingView enabled={true}
                                  behavior="padding"
                                  style={{flex: 1}}>
                {props.children}
            </KeyboardAvoidingView>
        );
    }

    // not enabled on other platforms.
    return props.children;

}

