import {remote} from 'electron';
import {BrowserWindowReference} from '../../ui/dialog_window/BrowserWindowReference';
import {ElectronMainContext, ElectronRendererContext} from './ElectronContext';

/**
 * Determine the electron context we're running within.
 */
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
