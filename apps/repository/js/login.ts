import {Firebase} from '../../../web/js/firebase/Firebase';
import {Nav} from '../../../web/js/ui/util/Nav';
import {FirebaseUIAuth} from '../../../web/js/firebase/FirebaseUIAuth';
import * as firebase from '../../../web/js/firebase/lib/firebase';
import {URLs} from '../../../web/js/util/URLs';

window.addEventListener('load', async () => {

    Firebase.init();

    if (firebase.auth().currentUser === null) {

        const base = URLs.toBase(document.location!.href);

        const signInSuccessUrl = new URL('/apps/repository/index.html#configured', base).toString();

        FirebaseUIAuth.login({signInSuccessUrl});

        // bring up the UI so that we can login.
        FirebaseUIAuth.login();

    }

});

Firebase.init();

