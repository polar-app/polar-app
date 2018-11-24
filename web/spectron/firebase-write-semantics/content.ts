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
import {FirebaseTester} from '../../js/firestore/FirebaseTester';
import {Datastores} from '../../js/datastore/Datastores';
import {PersistenceLayers} from '../../js/datastore/PersistenceLayers';


SpectronRenderer.run(async (state) => {

    new FirebaseTester(state).run(async () => {

        const collectionName = "debug";
        // const iter = Date.now();
        const iter = 1543071938802;
        const doWrites = false;

        console.log("Using iter: " + iter);

        const firestore = await Firestore.getInstance();

        interface MetadataTrace {
            readonly id: string;
            readonly fromCache: boolean;
            readonly doc: any;
            readonly hasPendingWrites: boolean;
            readonly snapshotVersion?: number;
        }

        const metadataTraces: MetadataTrace[] = [];
        const perDocMetadataTraces: MetadataTrace[] = [];

        // console.log("FIXME: fromCache",
        // snapshot.metadata.fromCache, snapshot.metadata,
        // snapshot);


        // https://firebase.google.com/docs/reference/js/firebase.firestore.SnapshotMetadata
        //  fromCache boolean  True if the snapshot was created from cached
        // data rather than guaranteed up-to-date server data. If your
        // listener has opted into metadata updates (via
        // SnapshotListenOptions) you will receive another snapshot with
        // fromCache set to false once the client has received up-to-date
        // data from the backend.  hasPendingWrites boolean  True if the
        // snapshot includes local writes (set() or update() calls) that
        // haven't been committed to the backend yet.  If your listener has
        // opted into metadata updates via SnapshotListenOptions, you
        // receive another snapshot with hasPendingWrites set to false once the writes have been committed to the backend.

        const onSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {

            console.log("FIXME onSnapshot: ===============================");

            console.log("FIXME onSnapshot snapshot: ", snapshot);

            console.log("FIXME: onSnapshot: We have N docs: " + snapshot.docs.length);
            console.log("FIXME: onSnapshot: We have N docChanges: " + snapshot.docChanges().length);

            console.log("FIXME: onSnapshot: docs: ", snapshot.docs);


            console.log("FIXME: onSnapshot: NR docChanges: ", snapshot.docChanges().length);

            console.log("FIXME: onSnapshot: docChanges: ", snapshot.docChanges());

            for (const docChange of snapshot.docChanges()) {

                console.log("FIXME id: ", docChange.doc.id);

                const metadataTrace: MetadataTrace = {
                    id: docChange.doc.id,
                    fromCache: snapshot.metadata.fromCache,
                    hasPendingWrites: snapshot.metadata.hasPendingWrites,
                    doc: docChange.doc.data()
                };

                console.log("FIXME onSnapshot/docChange docChange: ", docChange);
                console.log("FIXME onSnapshot/docChange metadataTrace: ", metadataTrace);

                metadataTraces.push(metadataTrace);

            }

        };

        await firestore
            .collection(collectionName)
            .where('iter', '==', iter)
            .onSnapshot({includeMetadataChanges: true}, snapshot => onSnapshot(snapshot));


        if (doWrites) {

            // now add some records
            const id0 = Hashcodes.createRandomID();
            const id1 = Hashcodes.createRandomID();

            console.log("FIXME: id0: " + id0);
            console.log("FIXME: id1: " + id1);

            const nrWrites = 1;

            for (const id of [id0]) {

                for (let idx = 0; idx < nrWrites; idx++) {

                    console.log("FIXME: writing with id: " + id);

                    const doc = {
                        foo: "bar",
                        version: idx,
                        iter
                    };

                    const ref = firestore.collection(collectionName).doc(id);

                    // FIXME: ok.. the LOCAL version is
                    //
                    //   fromCache==true && hasPendingWrites == true
                    //
                    // and when fully written to the server we have:
                    //
                    // fromCache==true && hasPendingWrites == true

                    let snapshotVersion = 0;

                    // FIXME: I enver receive a snapshot of the initial version
                    // saying that it does not exist...

                    // FIXME: why do I get an EXTRA callback?

                    // FIXME: we could call get({source: 'cache'}) here to make
                    // this operate faster I think but what if the local version
                    // isn't 100% in sync with the remote version and we do not,
                    // yet, have the latest copy.

                    ref.onSnapshot({includeMetadataChanges: true}, snapshot => {
                        console.log("FIXME999999: got per doc snapshot: ", snapshot);
                        console.log("FIXME999999: : fromCache: ", snapshot.metadata.fromCache);
                        console.log("FIXME999999: : hasPendingWrites: ", snapshot.metadata.hasPendingWrites);

                        const metadataTrace: MetadataTrace = {
                            id: snapshot.id,
                            fromCache: snapshot.metadata.fromCache,
                            hasPendingWrites: snapshot.metadata.hasPendingWrites,
                            doc: snapshot.data(),
                            snapshotVersion: snapshotVersion++
                        };

                        // console.log("FIXME33333333333333########33333333:  "
                        // + metadataTrace.snapshotVersion)

                        perDocMetadataTraces.push(metadataTrace);

                    });

                    await ref.set(doc);

                }

            }

        } else {
            console.log("Skipping writes");
        }


        await Promises.waitFor(5000);

        console.log("metadataTraces: ", metadataTraces);
        console.log("perDocMetadataTraces: ", perDocMetadataTraces);

    });

});
