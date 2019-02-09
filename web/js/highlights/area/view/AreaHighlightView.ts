import {ComponentManager} from '../../../components/ComponentManager';
import {DefaultContainerProvider} from '../../../components/containers/providers/impl/DefaultContainerProvider';
import {Model} from '../../../model/Model';
import {AreaHighlightComponent} from './components/AreaHighlightComponent';
import {AreaHighlightModel} from '../model/AreaHighlightModel';

export class AreaHighlightView {

    private componentManager: ComponentManager;

    /**
     *
     * @param model {Model}
     */
    constructor(model: Model) {

        this.componentManager = new ComponentManager(model,
                                                     new DefaultContainerProvider(),
                                                     () => new AreaHighlightComponent(),
                                                     () => new AreaHighlightModel());

    }

    public start() {
        this.componentManager.start();
    }

}
