import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {FirebaseTestRunner} from '../../js/firebase/FirebaseTestRunner';
import {Logger} from '../../js/logger/Logger';

mocha.setup('bdd');
mocha.timeout(10000);

SpectronRenderer.run(async (state) => {

    new FirebaseTestRunner(state).run(async () => {

        console.log("FIXME: running firefase tests...");

    }).catch(err => console.error(err));

});
