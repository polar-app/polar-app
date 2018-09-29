import {SpectronRenderer} from '../../js/test/SpectronRenderer';

// require('firebase');
import {Firebase} from './Firebase';
import {FirebaseUIAuth} from './FirebaseUIAuth';
// import {FirebaseUIAuth} from './FirebaseUIAuth';

SpectronRenderer.run(async () => {

    console.log("Running within SpectronRenderer now.");

    Firebase.init();
    FirebaseUIAuth.start();

});

