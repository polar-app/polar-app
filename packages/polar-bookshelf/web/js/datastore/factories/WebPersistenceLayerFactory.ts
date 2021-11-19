import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {FirebaseDatastore} from '../FirebaseDatastore';
import {AbstractAdvertisingPersistenceLayer} from '../advertiser/AbstractAdvertisingPersistenceLayer';
import {PersistenceLayer, PersistenceLayerID} from '../PersistenceLayer';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {TracedDatastore} from '../TracedDatastore';
import {DataFileCacheDatastore} from '../DataFileCacheDatastore';


export class WebPersistenceLayerFactory {

    public static create(): ListenablePersistenceLayer {

        const toDatastore = () => {

            FirebaseBrowser.init();

            const firebaseDatastore = new FirebaseDatastore();
            const dataFileCacheDatastore = new DataFileCacheDatastore(firebaseDatastore);
            const tracedDatastore = new TracedDatastore(dataFileCacheDatastore, 'traced-firebase');
            return tracedDatastore;

        };

        const datastore = toDatastore();

        console.log("Using datastore: " + datastore.id);

        return new NullListenablePersistenceLayer(new DefaultPersistenceLayer(datastore));

    }

}

export class NullListenablePersistenceLayer extends AbstractAdvertisingPersistenceLayer {

    public readonly id: PersistenceLayerID = 'null';

    constructor(delegate: PersistenceLayer) {
        super(delegate);
    }

    protected broadcastEvent(event: PersistenceLayerEvent): void {
    }

}


