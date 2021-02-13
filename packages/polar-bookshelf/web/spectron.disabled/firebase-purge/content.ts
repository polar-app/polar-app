import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {FirebaseTestRunner} from '../../js/firebase/FirebaseTestRunner';
import {Datastores} from '../../js/datastore/Datastores';
import {Logging} from '../../js/logger/Logging';

Logging.initForTesting();

SpectronRenderer.run(async (state) => {

    new FirebaseTestRunner(state).run(async () => {

        async function purgeFirebase() {

            const firebaseDatastore = new FirebaseDatastore();

            await firebaseDatastore.init();

            console.log("Purging...");

            await Datastores.purge(firebaseDatastore, purgeEvent => {
                console.log("Purged: ", purgeEvent);
            });

            console.log("Purging...done");

        }

        await purgeFirebase();

    }).catch(err => console.error(err));

});
