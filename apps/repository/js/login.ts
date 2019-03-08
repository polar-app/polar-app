import {Firebase} from '../../../web/js/firebase/Firebase';
import {Nav} from '../../../web/js/ui/util/Nav';
import {FirebaseUIAuth} from '../../../web/js/firebase/FirebaseUIAuth';
import * as firebase from '../../../web/js/firebase/lib/firebase';
import {URLs} from '../../../web/js/util/URLs';
import {AppRuntime} from '../../../web/js/AppRuntime';

window.addEventListener('load', async () => {

    Firebase.init();

    if (firebase.auth().currentUser === null) {

        const base = URLs.toBase(document.location!.href);

        const signInPath
            = AppRuntime.isBrowser() ? "/" : '/apps/repository/index.html#configured';

        const signInSuccessUrl = new URL(signInPath, base).toString();

        FirebaseUIAuth.login({signInSuccessUrl});

    }

});

Firebase.init();

