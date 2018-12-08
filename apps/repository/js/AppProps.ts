import {ListenablePersistenceLayer} from '../../../web/js/datastore/ListenablePersistenceLayer';
import {IEventDispatcher} from '../../../web/js/reactor/SimpleReactor';
import {IDocInfo} from '../../../web/js/metadata/DocInfo';
import {IProvider} from '../../../web/js/util/Providers';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';

export interface AppProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

}

/**
 * Create a new PeristenceLayer. Note that this must NOT be initialized becuase
 * we may want to add event listeners.
 */
export type PersistenceLayerFactory = () => ListenablePersistenceLayer;
