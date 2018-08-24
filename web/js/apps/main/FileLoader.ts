import {WebResource} from '../../electron/webresource/WebResource';

/**
 * A File Loader handles loading a file in the cache registry and returning a
 * URL that the user can work with.  The user then loads that URL into the
 * renderer.
 *
 * @abstract
 */

export interface FileLoader {

    /**
     * Compute a URL to load a file in the UI a PHZ file and registers it
     * with the CacheRegistry so it can be loaded properly.
     *
     * @param path {string}
     * @return {string}
     */
    registerForLoad(path: string): Promise<WebResource>;

}
