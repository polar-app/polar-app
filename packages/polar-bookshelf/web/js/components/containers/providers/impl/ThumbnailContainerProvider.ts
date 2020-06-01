import {ContainerProvider} from '../ContainerProvider';
import {ThumbnailContainerLifecycleListener} from '../../lifecycle/impl/ThumbnailContainerLifecycleListener';
import {Container} from '../../Container';

export class ThumbnailContainerProvider extends ContainerProvider {

    getContainers() {
        return super._getContainers(".thumbnail");
    }

    createContainerLifecycleListener(container: Container) {
        return new ThumbnailContainerLifecycleListener(container);
    }

}
