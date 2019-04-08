
const fs = require('fs');

function createCommonGlobsForStaticAssetsAtPath(path, exts) {

    // const exts = ["css", "html", "png", "svg", "ico", "woff2"];

    if (! exts) {
        exts = ["css", "html", "png", "svg", "ico", "woff2"];
    }

    const result = [];

    for (const ext of exts) {
        result.push(path + "/**/*." + ext);
    }

    return result;

}


function createCommonGlobsForPath(path, exts) {

    if (! exts) {
        exts = ["css", "js", "html", "png", "svg", "ico", "woff2"];
    }

    const result = [];

    for (const ext of exts) {
        result.push(path + "/**/*." + ext);
    }

    return result;

}

function createPDFJSGlobs() {

    return [

        'pdfviewer/build/pdf.js',
        'pdfviewer/build/pdf.worker.js',
        'pdfviewer/web/viewer.js',
        'pdfviewer/web/viewer.css',
        'pdfviewer/web/index.html',
        'pdfviewer/web/locale/en-US/viewer.properties',
        'pdfviewer/web/locale/en-GB/viewer.properties',
        ...createCommonGlobsForPath('pdfviewer/web/images', ["png", "svg"]),

    ];

}

const globPatterns = [

    ...createCommonGlobsForStaticAssetsAtPath('apps', ["css", "html", "svg"]),
    ...createCommonGlobsForPath('htmlviewer', ["css", "html"]),

    ...createPDFJSGlobs(),

    ...createCommonGlobsForPath('pdfviewer-custom', ['css']),
    ...createCommonGlobsForPath('web/dist'),
    ...createCommonGlobsForPath('web/assets'),
    'icon.ico',
    'icon.png',
    'icon.svg',
    'manifest.json',
    'apps/init.js',
    'apps/service-worker-registration.js',
    // now the custom specified resources that we need for the webapp to
    // function (scripts and CSS)
    'node_modules/firebase/firebase.js',
    'node_modules/firebaseui/dist/firebaseui.js',
    'node_modules/firebaseui/dist/firebaseui.css',
    'node_modules/react-table/react-table.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
    'node_modules/bootstrap/dist/css/bootstrap-reboot.min.css',
    'node_modules/toastr/build/toastr.min.css',
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    'node_modules/@burtonator/react-dropdown/dist/react-dropdown.css',
    'node_modules/summernote/dist/summernote-bs4.css',

];

console.log("Using static file globs: \n ", globPatterns.join("\n  "));

module.exports = {
    globDirectory: 'dist/public',
    globPatterns,
    globIgnores: [],
    globStrict: false,
    // stripPrefix: 'dist/public',
    maximumFileSizeToCacheInBytes: 15000000,
    // runtimeCaching: [{
    //     urlPattern: /this\\.is\\.a\\.regex/,
    //     handler: 'networkFirst'
    // }]
    swDest: 'dist/public/service-worker.js',
    modifyURLPrefix: {
        // Remove a '/dist' prefix from the URLs:
        '/dist/public': ''
    }
};






