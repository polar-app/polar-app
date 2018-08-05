/**
 * Determine the electron context we're running within.
 */
import {WindowReference} from '../../ui/dialog_window/WindowReference';

export interface ElectronContext {

    readonly type: ElectronContextType;

}

export enum ElectronContextType {
    MAIN,
    RENDERER
}

export class ElectronMainContext implements ElectronContext {
    public readonly type = ElectronContextType.MAIN;
}

export class ElectronRendererContext implements ElectronContext {

    public readonly type = ElectronContextType.RENDERER;

    public readonly windowReference: WindowReference;

    constructor(windowReference: WindowReference) {
        this.windowReference = windowReference;
    }

}
