const path = require('path');
const fs = require('fs');
const os = require('os');
const url = require('url');

/**
 * Work around for the issue of loading modules with require in Electron when
 * loading file URLs and needing to access the filesystem.
 *
 * @param loadPath {string} The path to the file relative to document.location.href.
 * @private
 */
function load(loadPath) {

    /**
     * The os.type() method returns a string identifying the operating system
     * name as returned by uname(3). For example 'Linux' on Linux, 'Darwin' on
     * macOS and 'Windows_NT' on Windows.
     *
     * @type {string}
     */
    const os_type = os.type();

    return _loadFromHref(document.location.href, loadPath, os_type);
}

/**
 *
 * @param href  The URL we're currently working with in the browser.
 * @param loadPath The path we want to load.
 * @param os_type  The os_type we're running under.
 * @private
 */
function _loadFromHref(href, loadPath, os_type) {
    let resolvedPath = _resolveFromHref(href, loadPath, os_type);
    require(resolvedPath);
}

/**
 * Convert the given file: URL to a local path.
 *
 * @param href  The URL we're currently working with in the browser.
 * @param os_type The os we're running under.
 * @return {string}
 * @private
 */
function _toPath(href, os_type) {

    let result = href;

    if(! result.startsWith('file:')) {
        throw new Error("Not a file URL");
    }

    // remove the file URL portion

    result = result.replace('file://', '');

    // TODO: if we're on Windows we have to remove an additional '/' in the
    // path
    // https://blogs.msdn.microsoft.com/ie/2006/12/06/file-uris-in-windows/
    // https://github.com/TooTallNate/file-uri-to-path/blob/master/index.js

    // os.type is 'Windows_NT' on Windows

    if(os_type === 'Windows_NT') {

        // on Windows there's a / prefix on file names.
        result = result.substring(1);

        // 3.2  Drives, drive letters, mount points, file system root
        // Drive letters are mapped into the top of a file URI in various ways,
        // depending on the implementation; some applications substitute
        // vertical bar ("|") for the colon after the drive letter, yielding
        // "file:///c|/tmp/test.txt".  In some cases, the colon is left
        // unchanged, as in "file:///c:/tmp/test.txt".  In other cases, the
        // colon is simply omitted, as in "file:///c/tmp/test.txt".
        result = result.replace(/^(.+)\|/, '$1:');

        // for Windows, we need to invert the path separators from what a URI uses
        result = result.replace(/\//g, '\\');

    }

    // now remove the filename and the query data.
    result = result.replace(/[^/.]+\.html([#?].*)?$/, '');

    result = decodeURI(result);

    return result;

}

/**
 *
 * @param from The starting URL to resolve from.
 * @param to The path to resolve based on the from URL.
 * @return {string}
 * @private
 */
function _resolveURL(from, to) {
    return url.resolve(from, to);
}

/**
 * Performs the full resolution for us but does not do the require.
 *
 * @param href {string} The document.location.href
 * @param loadPath {string} The path expression to load.
 * @param os_type The os we're running under.
 * @private
 */
function _resolveFromHref(href, loadPath, os_type) {

    let resolvedURL = _resolveURL(href, loadPath);

    let resolvedPath = _toPath(resolvedURL, os_type);

    if(! fs.existsSync(resolvedPath)) {
        throw new Error(`Could not find ${loadPath} from basedir ${basedir} (not found): ${resolvedPath}`);
    }

    return resolvedPath;

}

module.exports._toPath = _toPath;
module.exports._resolveFromHref = _resolveFromHref;
module.exports._loadFromHref = _loadFromHref;
module.exports._resolveURL = _resolveURL;
module.exports.load = load;
