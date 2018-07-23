const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

/**
 *
 * @param name
 * @param entryPath {string} the path to the webpack entrypoint script.
 * @param target {string} The webpack target.  Either electron-main or electron-renderer.
 */
function createWebpackConfig(name, entryPath, target = "electron-renderer") {

    entryPath = path.resolve(__dirname, entryPath);
    let outputDir = path.dirname(entryPath);

    let config = {
        mode: 'development',
        // TODO
        target: target,
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

    };

    if(target === "electron-main") {
        // this saves about 10x when running in electron-main.  We don't need
        // to statically link all the modules here.  It doesn't work with the
        // electron renderer though. I thought it would be it appears to fail.
        config.externals = [nodeExternals()];
    }

    return config;

}

module.exports = [];

module.exports.push(createWebpackConfig("injector", "web/js/apps/injector.js"));
module.exports.push(createWebpackConfig("electron", "web/js/apps/electron.js"));
module.exports.push(createWebpackConfig("start-capture", "apps/capture/start-capture/js/entry.js"));
module.exports.push(createWebpackConfig("progress", "apps/capture/progress/js/entry.js"));
module.exports.push(createWebpackConfig("card-creator", "apps/card-creator/js/entry.js"));
module.exports.push(createWebpackConfig("dialog", "test/sandbox/dialog/js/entry.js"));
module.exports.push(createWebpackConfig("webcomponents", "test/sandbox/webcomponents/js/entry.js"));

module.exports.push(createWebpackConfig("main", "main.js", "electron-main"));
module.exports.push(createWebpackConfig("capture", "capture.js", "electron-main"));
