import * as libpath from 'path';
import * as os from 'os';
import {Optional} from './ts/Optional';
import {isPresent, Preconditions} from '../Preconditions';
import url from 'url';

/**
 * Work with file paths cross platform and work with the file separator using
 * the / char on Unix and the \ char on Windows.
 *
 * DO NOT call this for URI paths that are always / no matter what OS you are
 * on.
 */
export class FilePaths {

    /**
     * The OS specific file separator.
     */
    public static readonly SEP = libpath.sep;

    // FIXME: THIS is the bug.. Windows just needs to die!  We're not properly
    // building URI paths due to this issue now...

    /**
     * Create a path from the given parts regardless of their structure.
     *
     * Don't allow double // or trailing /.  The output is always sane.
     *
     * @param dirname
     * @param basename
     */
    public static create(dirname: string, basename: string) {
        let result = this.join(dirname, basename);

        if (result.endsWith(libpath.sep)) {
            result = result.substring(0, result.length - 1);
        }

        return result;
    }

    /**
     * Join all arguments together and normalize the resulting path.
     *
     * Arguments must be strings. In v0.8, non-string arguments were silently
     * ignored. In v0.10 and up, an exception is thrown.
     *
     * @param paths paths to join.
     */
    public static join(...paths: string[]): string {
        return libpath.join(...paths);
    }

    /**
     * The right-most parameter is considered {to}.  Other parameters are
     * considered an array of {from}.
     *
     * Starting from leftmost {from} parameter, resolves {to} to an absolute
     * path.
     *
     * If {to} isn't already absolute, {from} arguments are prepended in right
     * to left order, until an absolute path is found. If after using all
     * {from} paths still no absolute path is found, the current working
     * directory is used as well. The resulting path is normalized, and
     * trailing slashes are removed unless the path gets resolved to the root
     * directory.
     *
     * @param pathSegments string paths to join.  Non-string arguments are
     *     ignored.
     */
    public static resolve(...pathSegments: string[]) {
        return libpath.resolve(...pathSegments);
    }

    /**
     * Return the last portion of a path. Similar to the Unix basename command.
     * Often used to extract the file name from a fully qualified path.
     *
     * Note that this behaves differently on Windows vs Linux.  The path
     * separator is changed and different values are returned for the platform.
     *
     * @param p the path to evaluate.
     * @param ext optionally, an extension to remove from the result.
     */
    public static basename(p: string, ext?: string) {
        return libpath.basename(p, ext);
    }

    public static dirname(path: string) {
        return libpath.dirname(path);
    }

    public static tmpdir() {
        return os.tmpdir();
    }

    /**
     * @deprecated use createTempName
     */
    public static tmpfile(name: string) {
        return this.join(os.tmpdir(), name);
    }

    /**
     * Create a named path entry in /tmp
     */
    public static createTempName(name: string) {
        return this.join(os.tmpdir(), name);
    }

    /**
     * Create a windows path from unix path.  Mostly used for testing.
     */
    public static toWindowsPath(path: string) {
        path = path.replace(/\//g, '\\' );
        return 'C:' + path;
    }

    /**
     * Find unix path strings in text and replace them with windows-like paths.
     *
     * Used for testing.
     */
    public static textToWindowsPath(text: string) {

        return text.replace(/(\/[a-zA-Z0-9_-]+)+(\/[a-zA-Z0-9_-]+\.[a-z]{2,3})/g, (substr: string) => {
            return this.toWindowsPath(substr);
        });

    }

    public static toFileURL(path: string) {

        // https://stackoverflow.com/questions/20619488/how-to-convert-local-file-path-to-a-file-url-safely-in-node-js

        // TODO: The new pathToFileURL function added in NodeJS 10.12 and
        // Electron 3.0.89 is on 10.2 at the time so we can't use this function
        // even though it's better.

        Preconditions.assertTypeOf(path, 'string', 'path');

        path = FilePaths.resolve(path);

        if (this.SEP === '\\') {

            path = path.replace(/\\/g, '/');

            // Windows drive letter must be prefixed with a slash
            if (path[0] !== '/') {
                path = '/' + path;
            }

        }

        return encodeURI('file://' + path);

    }

    /**
     * If the file ends with .txt, .pdf, .html then return the extension.
     * @param path
     */
    public static toExtension(path: string): Optional<string> {

        if (! isPresent(path)) {
            return Optional.empty();
        }

        const matches = path.match(/\.([a-z0-9]{3,4})$/);

        if (matches && matches.length === 2) {
            return Optional.of(matches[1]);
        }

        return Optional.empty();

    }

}
