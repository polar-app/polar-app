import {IListenablePersistenceLayer} from '../../../web/js/datastore/IListenablePersistenceLayer';
import {IEventDispatcher} from '../../../web/js/reactor/SimpleReactor';
import {IDocInfo} from '../../../web/js/metadata/DocInfo';

export interface AppProps {

    readonly persistenceLayerFactory: PersistenceLayerFactory;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

}

/**
 * Create a new PeristenceLayer. Note that this must NOT be initialized becuase
 * we may want to add event listeners.
 */
export type PersistenceLayerFactory = () => IListenablePersistenceLayer;
