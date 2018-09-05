
import {remote} from 'electron';
/**
 * Determine the electron context we're running within.
 */
import {BrowserWindowReference} from '../../ui/dialog_window/BrowserWindowReference';
import {ElectronMainContext, ElectronRendererContext} from './ElectronContext';

export class ElectronContexts {

    static create() {

        if(! remote) {
            return new ElectronMainContext();
        } else {
            return new ElectronRendererContext(new BrowserWindowReference(remote.getCurrentWindow().id));
        }

    }

}
