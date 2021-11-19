import {ipcMain, ipcRenderer} from '../../polar-bookshelf/web/js/electron';

/**
 * Used to determine if we're running in Electron or Chrome.
 */
export namespace DesktopAppRuntime {

    export function get(): DesktopAppRuntimeName {

        if (ipcRenderer) {
            return 'electron-renderer';
        } else if (ipcMain) {
            return 'electron-main';
        } else {
            return 'browser';
        }

    }

    /**
     * A higher level runtime type (electron or browser)
     */
    export function type(): DesktopAppRuntimeType {

        switch (get()) {

            case 'electron-renderer':
                return 'electron';

            case 'electron-main':
                return 'electron';

            case 'browser':
                return 'browser';

        }

    }

    export function isElectron() {
        return get().startsWith('electron-');
    }

    export function isBrowser() {
        return get() === 'browser';
    }

}

export type DesktopAppRuntimeName = 'electron-renderer' | 'electron-main' | 'browser';

export type DesktopAppRuntimeType = 'electron' | 'browser';

