import {DocMeta} from '../metadata/DocMeta';
import {ListenablePersistenceLayer} from '../datastore/ListenablePersistenceLayer';
import {ModelPersister} from './ModelPersister';
import {PersistenceLayerHandler} from '../datastore/PersistenceLayerManager';

export class ModelPersisterFactory {

    constructor(private readonly persistenceLayerHandler: PersistenceLayerHandler) {
    }

    /**
     * Initialize a new persistent Model.
     */
    public create(docMeta: DocMeta): ModelPersister {
        return new ModelPersister(this.persistenceLayerHandler, docMeta);
    }

}

