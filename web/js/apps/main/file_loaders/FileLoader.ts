import {LoadedFile} from './LoadedFile';
import {Files} from '../../../util/Files';
import {FilePaths} from '../../../util/FilePaths';
import {Directories} from '../../../datastore/Directories';
import {Logger} from '../../../logger/Logger';

const log = Logger.create();

/**
 * A File Loader handles loading a file in the cache registry and returning a
 * URL that the user can work with.  The user then loads that URL into the
 * renderer.
 *
 * @abstract
 */

export abstract class FileLoader {

    /**
     * Compute a URL to load a file in the UI a PHZ file and registers it
     * with the CacheRegistry so it can be loaded properly.
     *
     * @param path
     * @return
     */
    public abstract registerForLoad(path: string): Promise<LoadedFile>;

}
