import {ElectronContext} from './ElectronContext';

export class IPCSender {

    public readonly electronContext: ElectronContext;

    constructor(electronContext: ElectronContext) {
        this.electronContext = electronContext;
    }

}
