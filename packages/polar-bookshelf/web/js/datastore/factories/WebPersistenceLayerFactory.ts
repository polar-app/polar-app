import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {FirebaseDatastore} from '../FirebaseDatastore';
import {PersistenceLayer} from '../PersistenceLayer';
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {TracedDatastore} from '../TracedDatastore';
import {DataFileCacheDatastore} from '../DataFileCacheDatastore';

export class WebPersistenceLayerFactory {

    public static create(): PersistenceLayer {

        const toDatastore = () => {

            FirebaseBrowser.init();

            const firebaseDatastore = new FirebaseDatastore();
            const dataFileCacheDatastore = new DataFileCacheDatastore(firebaseDatastore);
            const tracedDatastore = new TracedDatastore(dataFileCacheDatastore, 'traced-firebase');
            return tracedDatastore;

        };

        const datastore = toDatastore();

        console.log("Using datastore: " + datastore.id);

        return new DefaultPersistenceLayer(datastore);

    }

}

