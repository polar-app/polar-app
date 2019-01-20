/**
 * Used to determine if we're running in Electron or Chrome.
 */
export class AppRuntime {

    public static get(): AppRuntimeType {

        if (typeof require === 'function') {
            return 'electron';
        } else {
            return 'browser';
        }

    }

}

export type AppRuntimeType = 'electron' | 'browser';

