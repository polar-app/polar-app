import {DocMeta} from '../metadata/DocMeta';
import {ListenablePersistenceLayer} from '../datastore/ListenablePersistenceLayer';
import {ModelPersister} from './ModelPersister';

export class ModelPersisterFactory {

    private readonly persistenceLayer: ListenablePersistenceLayer;

    constructor(persistenceLayer: ListenablePersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }

    /**
     * Initialize a new persistent Model.
     */
    public create(docMeta: DocMeta): ModelPersister {
        return new ModelPersister(this.persistenceLayer, docMeta);
    }

}

