import {ContainerProvider} from '../ContainerProvider';
import {DefaultContainerLifecycleListener} from '../../lifecycle/impl/DefaultContainerLifecycleListener';
import {Container} from '../../Container';


export class DefaultContainerProvider extends ContainerProvider {

    getContainers() {
        return super._getContainers(".page");
    }

    /**
     * @Override
     * @param container {Container}
     * @return {ContainerLifecycleListener}
     */
    createContainerLifecycleListener(container: Container) {
        return new DefaultContainerLifecycleListener(container);
    }

}
