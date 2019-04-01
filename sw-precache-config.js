function createCommonGlobsForPath(path) {

    const exts = ["css", "js", "html", "png", "svg", "ico", "woff2"];

    const result = [];

    for (const ext of exts) {
        result.push(path + "/**/*." + ext);
    }

    return result;

}

const staticFileGlobs = [

    ...createCommonGlobsForPath('apps'),
    ...createCommonGlobsForPath('htmlviewer'),
    ...createCommonGlobsForPath('pdfviewer'),
    ...createCommonGlobsForPath('pdfviewer-custom'),
    ...createCommonGlobsForPath('web/dist'),
    ...createCommonGlobsForPath('web/assets'),
    'icon.ico',
    'icon.png',
    'icon.svg',

    // now the custom specified resources that we need for the webapp to
    // function (scripts and CSS)
    //
    '/node_modules/firebase/firebase.js',
    '/node_modules/firebaseui/dist/firebaseui.js',
    '/node_modules/firebaseui/dist/firebaseui.css',
    '/node_modules/react-table/react-table.css',
    '/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '/node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
    '/node_modules/bootstrap/dist/css/bootstrap-reboot.min.css',
    '/node_modules/toastr/build/toastr.min.css',
    '/node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    '/node_modules/@burtonator/react-dropdown/dist/react-dropdown.css',
    '/node_modules/summernote/dist/summernote-bs4.css',

];

console.log("Using static file globs: \n ", staticFileGlobs.join("\n  "));

module.exports = {
    root: 'dist/public',
    staticFileGlobs,
    stripPrefix: 'dist/public',
    maximumFileSizeToCacheInBytes: 15000000,
    // runtimeCaching: [{
    //     urlPattern: /this\\.is\\.a\\.regex/,
    //     handler: 'networkFirst'
    // }]
};






