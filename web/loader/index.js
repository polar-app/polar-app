const path = require('path');

/**
 * Work around for the issue of loading modules with require in Electron when
 * loading file URLs and needing to access the filesystem.
 */
function load(loadPath) {

    let basedir = document.location.href;

    if(! basedir.startsWith('file:')) {
        throw new Error("Not a file URL");
    }

    // remove the file URL portion

    basedir = basedir.replace('file://', '');

    // now remove the filename and the query data.
    basedir = basedir.replace(/[^/.]+\.html(#.*)?$/, '');

    require(path.resolve(basedir, loadPath));

}

module.exports.load = load;
