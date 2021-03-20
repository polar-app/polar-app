import {remote} from 'electron';
import {ElectronContextType} from './ElectronContextType';

/**
 * Determine the electron context we're running within.
 */

export class ElectronContextTypes {

    public static create() {

        if (remote) {
            return ElectronContextType.RENDERER;
        } else {
            return ElectronContextType.MAIN;
        }

    }

}
