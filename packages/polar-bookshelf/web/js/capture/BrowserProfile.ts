import {IBrowser} from 'polar-content-capture/src/capture/Browser';
import {Navigation} from './navigation/Navigation';

export interface BrowserProfile extends IBrowser {

    /**
     * A unique instance ID for this browser profile.
     */
    id: BrowserProfileID;

    /**
     * The name of this profile.
     */
    profile: string;

    /**
     *
     * True when the browser should be shown while we are capturing.
     */
    show: boolean;

    /**
     *
     * True when we should use the offscreen support in Electron.
     */
    offscreen: boolean;

    nodeIntegration: boolean;

    navigation: Navigation;

    useReactor: boolean;

    webaudio: boolean;

    /**
     * When true the webview control is hosted in another window so it would be
     * best to increase the host window size slightly and make other
     * optimizations.
     */
    hosted: boolean;

    /**
     * When true (the default) we should destroy the driver when done.  Normally
     * it should be destroyed but for testing this might be problematic.
     */
    destroy: boolean;

}

export type BrowserProfileID = number;
