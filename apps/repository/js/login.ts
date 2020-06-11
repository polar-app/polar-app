import {Firebase} from '../../../web/js/firebase/Firebase';
import {FirebaseUIAuth} from '../../../web/js/firebase/FirebaseUIAuth';
import * as firebase from 'firebase/app';
import {AppRuntime} from '../../../web/js/AppRuntime';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';
import {ExternalNavigationBlock} from "../../../web/js/electron/navigation/ExternalNavigationBlock";
import {Analytics} from "../../../web/js/analytics/Analytics";
import {SignInSuccessURLs} from "./login/SignInSuccessURLs";

class InitialLogin {

    public static get() {

        const key = "has-login";

        const result = localStorage.getItem(key) !== 'true';

        localStorage.setItem(key, 'true');

        return result;

    }

    public static sentAnalytics() {

        if (this.get()) {
            const runtime = AppRuntime.type();
            const category = runtime + '-login';
            Analytics.event({category, action: 'initial'});
        }

    }

}


window.addEventListener('load', async () => {

    Firebase.init();

    if (firebase.auth().currentUser === null) {

        const signInSuccessUrl = SignInSuccessURLs.get();
        FirebaseUIAuth.login({signInSuccessUrl});

    }

    RendererAnalytics.pageviewFromLocation();

    InitialLogin.sentAnalytics();

});

// disable the external navigation block during login for now.
ExternalNavigationBlock.set(false);

Firebase.init();

