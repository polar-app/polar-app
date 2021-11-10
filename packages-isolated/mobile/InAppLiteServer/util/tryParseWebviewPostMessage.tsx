import {NativeSyntheticEvent} from "react-native";
import {WebViewMessage} from "react-native-webview/lib/WebViewTypes";

export default function tryParseWebviewPostMessage(event: NativeSyntheticEvent<WebViewMessage>): {
    action: "console_log" | "buy_play" | "android-go-back-exhausted",
    data?: {
        plan?: "plus" | "pro",
        email: string,
    },
} | undefined {
    try {
        return JSON.parse(event.nativeEvent.data);
    } catch (e) {
        return undefined;
    }
}
