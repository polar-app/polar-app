/**
 * The state of the container.
 */
import {Container} from '../Container';

export class ContainerLifecycleState {

    public readonly visible: boolean;

    public readonly container: Container;

    constructor(opts: any) {

        this.visible = opts.visible;
        this.container = opts.container;

    }

}
