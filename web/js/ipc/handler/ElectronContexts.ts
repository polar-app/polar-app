
import {remote} from 'electron';
/**
 * Determine the electron context we're running within.
 */
import {WindowReference} from '../../ui/dialog_window/WindowReference';
import {ElectronMainContext, ElectronRendererContext} from './ElectronContext';

export class ElectronContexts {

    static create() {

        if(! remote) {
            return new ElectronMainContext();
        } else {
            return new ElectronRendererContext(new WindowReference(remote.getCurrentWindow().id));
        }

    }

}
