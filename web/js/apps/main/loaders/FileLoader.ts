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
     * @param path {string}
     * @return {string}
     */
    public abstract registerForLoad(path: string): Promise<LoadedFile>;

    /**
     * Import a file to the stash if it's not already in the stash so that
     * it opens for the next time.
     */
    public static async importToStash(path: string) {

        const currentDirname = await Files.realpathAsync(FilePaths.dirname(path));

        const directories = new Directories();

        const stashDir = await Files.realpathAsync(directories.stashDir);

        if (currentDirname !== stashDir) {

            const fileName = FilePaths.basename(path);
            const newPath = FilePaths.join(stashDir, fileName);

            path = await Files.realpathAsync(path);

            log.info(`Importing file from ${path} to ${newPath}`);

            await Files.copyFileAsync(path, newPath);
            return newPath;

        }

        return path;

    }

}
