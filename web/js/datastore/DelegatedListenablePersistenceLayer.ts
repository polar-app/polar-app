import {Datastore, DocMetaSnapshotEvent, FileMeta, FileRef, InitResult,
        DocMetaSnapshotEventListener, SnapshotResult, DatastoreID,
        AbstractDatastore,
    ErrorListener} from './Datastore';
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './Datastore';
import {Preconditions} from '../Preconditions';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {IDocInfo, DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {Datastores} from './Datastores';
import {PersistenceLayers} from './PersistenceLayers';
import {PersistenceLayer} from './PersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {FileHandle} from '../util/Files';
import {AdvertisingPersistenceLayer} from './advertiser/AdvertisingPersistenceLayer';
import {DelegatedPersistenceLayer} from './DelegatedPersistenceLayer';
import {ListenablePersistenceLayer} from './ListenablePersistenceLayer';
import {PersistenceLayerListener} from './PersistenceLayerListener';

/**
 * A PersistenceLayer that just forwards events to the given delegate.
 */
export class DelegatedListenablePersistenceLayer extends DelegatedPersistenceLayer implements ListenablePersistenceLayer {

    private readonly listenablePersistenceLayer: ListenablePersistenceLayer;

    constructor(listenablePersistenceLayer: ListenablePersistenceLayer) {
        super(listenablePersistenceLayer);
        this.listenablePersistenceLayer = listenablePersistenceLayer;
    }

    public addEventListener(listener: PersistenceLayerListener): void {
        this.listenablePersistenceLayer.addEventListener(listener);
    }

    public addEventListenerForDoc(fingerprint: string, listener: PersistenceLayerListener): void {
        this.listenablePersistenceLayer.addEventListenerForDoc(fingerprint, listener);
    }

}
