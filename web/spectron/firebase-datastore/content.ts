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
import {PersistenceLayerWorkers} from '../../js/datastore/dispatcher/PersistenceLayerWorkers';
import {IPersistenceLayer} from '../../js/datastore/IPersistenceLayer';

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

                let docReplicationEventListenerCalled: boolean = false;

                datastore.addDocReplicationEventListener((docMutation) => {
                    docReplicationEventListenerCalled = true;
                });

                await persistenceLayer.write(fingerprint, docMeta, datastoreMutation);

                assert.isFalse(docReplicationEventListenerCalled);

                await persistenceLayer.stop();

                // now create a new datastore to make sure we get the events we
                // need.

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


            it("Make sure we get replication events from a second datastore to the first", async function() {

                class ReplicationTester {

                    public datastore?: FirebaseDatastore;

                    public persistenceLayer?: IPersistenceLayer;

                    public hasDocReplicationEvent: boolean = false;

                    public async init() {
                        this.datastore = new FirebaseDatastore();
                        this.persistenceLayer = new DefaultPersistenceLayer(this.datastore);
                        await this.persistenceLayer.init();
                        return this;
                    }

                    public async setup() {

                        this.datastore!.addDocReplicationEventListener((docReplicationEvent) => {
                            this.hasDocReplicationEvent = true;
                        });

                        return this;

                    }

                    public async write() {

                        const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

                        await this.persistenceLayer!.write(fingerprint, docMeta);

                        return this;

                    }

                    public async stop() {
                        this.persistenceLayer!.stop();
                    }

                }

                const replicationTester0 = await new ReplicationTester().init();
                const replicationTester1 = await new ReplicationTester().init();

                await replicationTester0.setup();
                await replicationTester1.setup();

                await replicationTester1.write();

                assert.ok(replicationTester0.hasDocReplicationEvent, "replicationTester0 failed");
                assert.ok(!replicationTester1.hasDocReplicationEvent, "replicationTester1 failed");

                await replicationTester0.stop();
                await replicationTester1.stop();

            });


        });

        // DatastoreTester.test(() => firebaseDatastore, false);

    });

});
