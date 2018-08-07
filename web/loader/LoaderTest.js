
const assert = require('assert');
const loader = require('./index.js');

describe('Loader', function() {

    describe('_hrefToPath', function() {

        it("with regular query data", function () {

            let href = 'file:///home/burton/projects/polar-bookshelf/pdfviewer/web/viewer.html?file=http%3A%2F%2F127.0.0.1%3A8500%2Ffiles%2F1VMrRLSDsoHG6EiwuPSKY3Dwei8KFXZZFKeeH6mkoWEhB6B8vN';

            let basedir = loader.hrefToBasedir(href);
            assert.equal(basedir, '/home/burton/projects/polar-bookshelf/pdfviewer/web/');

        });
    });


    describe('_resolveFromHref', function() {

        it("with regular query data", function () {

            let href = 'file:///home/burton/projects/polar-bookshelf/pdfviewer/web/viewer.html?file=http%3A%2F%2F127.0.0.1%3A8500%2Ffiles%2F1VMrRLSDsoHG6EiwuPSKY3Dwei8KFXZZFKeeH6mkoWEhB6B8vN';

            let resolvedPath = loader._resolveFromHref(href, '../../web/js/apps/electron.js');
            assert.equal(resolvedPath, '/home/burton/projects/polar-bookshelf/pdfviewer/web/');

        });
    });

});
