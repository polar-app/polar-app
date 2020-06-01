import {Container} from '../../Container';
import {AbstractContainerLifecycleListener} from './AbstractContainerLifecycleListener';
import doc = Mocha.reporters.doc;

/**
 * Listens to the lifecycle of .page
 */
export class DefaultContainerLifecycleListener extends AbstractContainerLifecycleListener {

    constructor(container: Container) {
        super(container);
    }

}
