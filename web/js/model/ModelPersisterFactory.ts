import {DocMeta} from '../metadata/DocMeta';
import {IListenablePersistenceLayer} from '../datastore/IListenablePersistenceLayer';
import {ModelPersister} from './ModelPersister';

export class ModelPersisterFactory {

    private readonly persistenceLayer: IListenablePersistenceLayer;

    constructor(persistenceLayer: IListenablePersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }

    /**
     * Initialize a new persistent Model.
     */
    public create(docMeta: DocMeta): ModelPersister {
        return new ModelPersister(this.persistenceLayer, docMeta);
    }

}

