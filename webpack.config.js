const path = require('path');
const webpack = require('webpack');

/**
 *
 * @param name
 * @param entryPath
 * @param distPath
 */
function createElectronRendererProfile(name, entryPath) {

    entryPath = path.resolve(__dirname, entryPath);
    let outputDir = path.dirname(entryPath);

    return {
        mode: 'development',
        target: "electron-renderer",
        entry: {
            name: [
                "idempotent-babel-polyfill",
                entryPath
            ]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }

                },
                // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                }
            ]
        },
        devtool: "inline-source-map",
        output: {
            path: outputDir,
            filename: `${name}-bundle.js`,
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                jQueryUI: "jquery-ui",
                "window.$": "jquery",
                "window.jQuery": "jquery",

                // popper is needed for summernote and jquery-ui
                Popper: 'popper.js',
            })
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },

    }

}

module.exports = [];

module.exports.push(createElectronRendererProfile("injector", "web/js/apps/injector.js", "web/dist"));
module.exports.push(createElectronRendererProfile("electron", "web/js/apps/electron.js", "web/dist"));
module.exports.push(createElectronRendererProfile("start-capture", "apps/capture/start-capture/js/entry.js", "apps/capture/start-capture/dist"));
module.exports.push(createElectronRendererProfile("progress", "apps/capture/progress/js/entry.js", "apps/capture/progress/dist"));
module.exports.push(createElectronRendererProfile("card-creator", "apps/card-creator/js/entry.js", "apps/card-creator/dist"));
module.exports.push(createElectronRendererProfile("dialog", "test/sandbox/dialog/js/entry.js", "test/sandbox/dialog/dist"));
module.exports.push(createElectronRendererProfile("webcomponents", "test/sandbox/webcomponents/js/entry.js", "test/sandbox/webcomponents/dist"));

module.exports.push(createElectronRendererProfile("main", "main.js"));
