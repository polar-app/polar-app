import {SpectronRenderer, SpectronRendererState} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firestore/Firebase';
import {FirebaseUIAuth} from '../../js/firestore/FirebaseUIAuth';
import * as firebase from '../../js/firestore/lib/firebase';
import {Elements} from '../../js/util/Elements';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {CompositeFirebaseDatastore} from '../../js/datastore/CompositeFirebaseDatastore';
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

mocha.setup('bdd');

const fingerprint = "0x001";

SpectronRenderer.run(async (state) => {

    new FirebaseTester(state).run(async () => {

        const firebaseDatastore = new FirebaseDatastore();

        await firebaseDatastore.init();

        describe('Cloud datastore tests', function() {

            it("Make sure we get events from the datastore", async function() {

                let datastore = new FirebaseDatastore();

                const persistenceLayer = new DefaultPersistenceLayer(datastore);

                await persistenceLayer.init();

                const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

                const datastoreMutation = new DefaultDatastoreMutation<DocInfo>();

                await persistenceLayer.sync(fingerprint, docMeta, datastoreMutation);

                await persistenceLayer.stop();

                datastore = new FirebaseDatastore();

                const latch = new Latch<boolean>();

                datastore.addDocMutationEventListener((docMutation) => {

                    if (docMutation.docInfo.fingerprint === fingerprint &&
                        docMutation.mutationType === 'added') {

                        latch.resolve(true);

                    }

                });

                await datastore.init();

                await latch.get();

                await datastore.stop();

            });

        });

        DatastoreTester.test(() => firebaseDatastore, false);

    });

});
