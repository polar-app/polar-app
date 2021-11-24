import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {FirebaseUIAuth} from '../../../web/js/firebase/FirebaseUIAuth';
import firebase from 'firebase/app'
import {Analytics} from "../../../web/js/analytics/Analytics";
import {SignInSuccessURLs} from "./login/SignInSuccessURLs";
import {AppRuntime} from 'polar-shared/src/util/AppRuntime';

class InitialLogin {

    public static get() {

        const key = "has-login";

        const result = localStorage.getItem(key) !== 'true';

        localStorage.setItem(key, 'true');

        return result;

    }

    public static sentAnalytics() {

        if (this.get()) {
            const runtime = AppRuntime.get();
            const category = runtime + '-login';
            Analytics.event({category, action: 'initial'});
        }

    }

}


window.addEventListener('load', () => {

    FirebaseBrowser.init();

    if (firebase.auth().currentUser === null) {

        const signInSuccessUrl = SignInSuccessURLs.get();
        FirebaseUIAuth.login({signInSuccessUrl});

    }

    // RendererAnalytics.pageviewFromLocation();

    InitialLogin.sentAnalytics();

});

FirebaseBrowser.init();

