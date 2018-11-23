import {SpectronRenderer, SpectronRendererState} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firestore/Firebase';
import {FirebaseUIAuth} from '../../js/firestore/FirebaseUIAuth';
import * as firebase from '../../js/firestore/lib/firebase';
import {Elements} from '../../js/util/Elements';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {assert} from "chai";
import {DatastoreTester} from '../../js/datastore/DatastoreTester';
import {Firestore} from '../../js/firestore/Firestore';
import {Hashcodes} from '../../js/Hashcodes';
import {Promises} from '../../js/util/Promises';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {DocLoader} from '../../js/apps/main/ipc/DocLoader';
import {FirebaseTester} from '../../js/firestore/FirebaseTester';
import {DefaultDatastoreMutation} from '../../js/datastore/DatastoreMutation';
import {DocInfo} from '../../js/metadata/DocInfo';
import {Latch} from '../../js/util/Latch';
import {PersistenceLayerWorkers} from '../../js/datastore/dispatcher/PersistenceLayerWorkers';
import {IPersistenceLayer} from '../../js/datastore/IPersistenceLayer';
import {Datastores} from '../../js/datastore/Datastores';
import waitForExpect from 'wait-for-expect';
import {BrowserWindowRegistry} from '../../js/electron/framework/BrowserWindowRegistry';
import {PersistenceLayers} from '../../js/datastore/PersistenceLayers';

SpectronRenderer.run(async (state) => {

    new FirebaseTester(state).run(async () => {

        const firebaseDatastore = new FirebaseDatastore();

        const source = new DefaultPersistenceLayer(new DiskDatastore());
        const target = new DefaultPersistenceLayer(firebaseDatastore);

        await Promise.all([source.init(), target.init()]);

        await Datastores.purge(firebaseDatastore, purgeEvent => {
            console.log("Purge event: ", purgeEvent);
        });

        await PersistenceLayers.synchronize(source, target, (transferEvent) => {
            console.log("Transfer event: ", transferEvent);
        });

        await Promise.all([source.stop(), target.stop()]);

    });

});
