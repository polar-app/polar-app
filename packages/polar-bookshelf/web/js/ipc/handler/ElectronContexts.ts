
import {remote} from 'electron';
/**
 * Determine the electron context we're running within.
 */
import {BrowserWindowReference} from '../../ui/dialog_window/BrowserWindowReference';
import {ElectronMainContext, ElectronRendererContext} from './ElectronContext';

export class ElectronContexts {

    public static create() {

        if (remote) {

            const browserWindowReference
                = new BrowserWindowReference(remote.getCurrentWindow().id);

            return new ElectronRendererContext(browserWindowReference);

        } else {
            return new ElectronMainContext();
        }

    }

}
