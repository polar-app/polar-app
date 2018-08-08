const path = require('path');
const fs = require('fs');

/**
 * Work around for the issue of loading modules with require in Electron when
 * loading file URLs and needing to access the filesystem.
 */
function load(loadPath) {
    return _loadFromHref(document.location.href, loadPath);
}

function _loadFromHref(href, loadPath) {
    let resolvedPath = _resolveFromHref(href, loadPath);
    require(resolvedPath);
}

function hrefToBasedir(href) {

    let result = href;

    if(! result.startsWith('file:')) {
        throw new Error("Not a file URL");
    }

    // remove the file URL portion

    result = result.replace('file://', '');

    // now remove the filename and the query data.
    result = result.replace(/[^/.]+\.html([#?].*)?$/, '');

    result = decodeURI(result);

    return result;

}

/**
 * Performs the full resolution for us but does not do the require.
 *
 * @param href {string} The document.location.href
 * @param loadPath {string} The path expression to load.
 * @return {string}
 * @private
 */
function _resolveFromHref(href, loadPath) {

    let basedir = hrefToBasedir(href);

    let resolvedPath = path.resolve(basedir, loadPath);

    if(! fs.existsSync(resolvedPath)) {
        throw new Error(`Could not find ${loadPath} from basedir ${basedir} (not found): ${resolvedPath}`);
    }

    return resolvedPath;

}

module.exports.hrefToBasedir = hrefToBasedir;
module.exports._resolveFromHref = _resolveFromHref;
module.exports._loadFromHref = _loadFromHref;
module.exports.load = load;
