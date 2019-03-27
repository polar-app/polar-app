import {Firebase} from '../../../web/js/firebase/Firebase';
import {Nav} from '../../../web/js/ui/util/Nav';
import {FirebaseUIAuth} from '../../../web/js/firebase/FirebaseUIAuth';
import * as firebase from '../../../web/js/firebase/lib/firebase';
import {URLs} from '../../../web/js/util/URLs';
import {AppRuntime} from '../../../web/js/AppRuntime';
import {Optional} from '../../../web/js/util/ts/Optional';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';

class SignInSuccessURLs {

    /**
     * Get the right sign in URL either the default or a custom if specified
     * by a URL param.
     */
    public static get() {

        return Optional.first(this.getCustom(), this.getDefault()).get();

    }

    /**
     * Allow the user to set a custom signInSuccessUrl as a param.
     */
    private static getCustom(): string | undefined {

        const url = new URL(document.location!.href);

        return Optional.of(url.searchParams.get('signInSuccessUrl'))
            .getOrUndefined();

    }

    private static getDefault(): string {

        const base = URLs.toBase(document.location!.href);

        const signInPath
            = AppRuntime.isBrowser() ? "/" : '/apps/repository/index.html#configured';

        return new URL(signInPath, base).toString();

    }

}

window.addEventListener('load', async () => {

    Firebase.init();

    if (firebase.auth().currentUser === null) {

        const signInSuccessUrl = SignInSuccessURLs.get();

        FirebaseUIAuth.login({signInSuccessUrl});

    }

    RendererAnalytics.pageviewFromLocation();

});

Firebase.init();

