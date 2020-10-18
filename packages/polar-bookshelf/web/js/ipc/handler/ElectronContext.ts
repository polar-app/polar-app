/**
 * Determine the electron context we're running within.
 */
import {BrowserWindowReference} from '../../ui/dialog_window/BrowserWindowReference';

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

    public readonly windowReference: BrowserWindowReference;

    constructor(windowReference: BrowserWindowReference) {
        this.windowReference = windowReference;
    }

}
