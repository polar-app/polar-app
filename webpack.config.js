const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

/**
 * Sync find files with a given suffix.
 *
 * @param path {string} The directory path to search for files.
 * @param suffix {string} Only find files with the given suffix.
 */
function findFiles(path, suffix) {

    let result = [];

    fs.readdirSync(path).forEach(current => {

        let currentPath = path + "/" + current;

        let stat = fs.lstatSync(currentPath);

        if (stat.isDirectory()) {
            result.push(...findFiles(currentPath, suffix));
        }

        if (stat.isFile()) {
            if(current.endsWith(suffix)) {
                result.push(currentPath);
            }
        }

    });

    return result;

}

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
        node: {
            __dirname: false
        }

    };

    if(target === "electron-main" || target === "node") {
        // this saves about 10x when running in electron-main.  We don't need
        // to statically link all the modules here.  It doesn't work with the
        // electron renderer though. I thought it would be it appears to fail.
        config.externals = [nodeExternals()];
    }

    return config;

}

// target is used to store our webpacked spectron and mocha tests..
//fs.mkdirSync("./target");

module.exports = [];

// TODO: consider moving all of these to /apps/dist.  It's weird that they're
// all over the filesystem now.

module.exports.push(createWebpackConfig("injector", "web/js/apps/injector.js"));
module.exports.push(createWebpackConfig("electron", "web/js/apps/electron.js"));
module.exports.push(createWebpackConfig("start-capture", "apps/capture/start-capture/js/entry.js"));
module.exports.push(createWebpackConfig("progress", "apps/capture/progress/js/entry.js"));
module.exports.push(createWebpackConfig("card-creator", "apps/card-creator/js/entry.js"));
module.exports.push(createWebpackConfig("dialog", "test/sandbox/dialog/js/entry.js"));
module.exports.push(createWebpackConfig("webcomponents", "test/sandbox/webcomponents/js/entry.js"));
module.exports.push(createWebpackConfig("ContentCaptureApp", "web/js/capture/renderer/ContentCaptureApp.ts"));

module.exports.push(createWebpackConfig("main", "main.js", "electron-main"));
module.exports.push(createWebpackConfig("capture", "capture.js", "electron-main"));

findFiles("web/js", "Test.js").forEach(file => {
    let name = path.basename(file).replace(".js", ""); // TODO support .ts tests.
    module.exports.push(createWebpackConfig(name, file, "node"));
});

// webpack each spectron index.js electron entrypoint
findFiles("test/spectron", "index.js").forEach(file => {
    let name = path.basename(file).replace(".js", ""); // TODO support .ts tests.
    module.exports.push(createWebpackConfig(name, file, "electron-main"));
});

// webpack each spectron index.js electron entrypoint
findFiles("test/spectron", "app.ts").forEach(file => {
    let name = path.basename(file).replace(".ts", "");
    module.exports.push(createWebpackConfig(name, file, "electron-renderer"));
});


// we need to webpack the spec file for spectron too
findFiles("test/spectron", "spec.js").forEach(file => {
    let name = path.basename(file).replace(".js", ""); // TODO support .ts tests.
    module.exports.push(createWebpackConfig(name, file, "node"));
});
