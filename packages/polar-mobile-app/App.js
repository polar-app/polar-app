import * as React from "react";
import { WebView } from "react-native-webview";
import UserAgent from "react-native-user-agent";

// var userAgent = navigator.userAgent;
// var hey = "hey";
// hey = hey.replace("hey", "");
// userAgent = userAgent.replace("wv", "");
export default class App extends React.Component {
  render() {
    return (
      <WebView
        source={{ uri: "https://beta.getpolarized.io/" }}
        // source={{
        //   uri: "https://www.whatismybrowser.com/detect/what-is-my-user-agent",
        // }}
        userAgent={getUserAgent()}
        style={{ width: "100%", height: "100%", marginTop: 20 }}
      />
    );
  }
}

//google blocks oath via WebView, this hides the fact that
// the app runs in web view.
function getUserAgent() {
  var TuserAgent = UserAgent.getUserAgent();
  TuserAgent = TuserAgent.replace("wv", "");

  //see node.js server log in dev
  console.log(TuserAgent);
  return TuserAgent;

  // return "Mozilla/5.0 (Linux; Android 9; Android SDK built for x86_64 Build/PSR1.180720.075) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36";
}
