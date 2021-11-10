import {Platform} from "react-native";

export default (): string => {
    return `
            // Allow the React app to read this and do stuff based on the fact, e.g. show or hide UI elements
            window.isNativeApp = true;
            window.mobileOS = "${Platform.OS}";
            
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
};
