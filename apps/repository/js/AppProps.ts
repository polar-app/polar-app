import {IListenablePersistenceLayer} from '../../../web/js/datastore/IListenablePersistenceLayer';
import {IEventDispatcher} from '../../../web/js/reactor/SimpleReactor';
import {IDocInfo} from '../../../web/js/metadata/DocInfo';

export interface AppProps {

    readonly persistenceLayer: IListenablePersistenceLayer;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

}
