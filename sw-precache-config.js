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
    ...createCommonGlobsForPath('web/dist'),
    ...createCommonGlobsForPath('web/assets'),
    'icon.ico',
    'icon.png',
    'icon.svg'
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
