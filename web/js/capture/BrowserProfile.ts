import {IBrowser} from './Browser';
import {LinkProvider} from './navigation/LinkProvider';
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

    linkProvider: LinkProvider;

    navigation: Navigation;

}

export type BrowserProfileID = number;
