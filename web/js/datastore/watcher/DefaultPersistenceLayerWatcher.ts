import {Reactor} from '../../reactor/Reactor';
import {DocMetaEvent, IPersistenceLayerListener, IPersistenceLayerWatcher} from './PersistenceLayerWatcher';

export class DefaultPersistenceLayerWatcher implements IPersistenceLayerWatcher {

    private readonly reactor = new Reactor<DocMetaEvent>()

    addEventListener(listener: IPersistenceLayerListener): void {
        this.reactor.addEventListener('event', listener);
    }

}
