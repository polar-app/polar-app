const path = require('path');
const webpack = require('webpack');

function createElectronRendererProfile(name, entryPath, distPath) {

    entryPath = path.resolve(__dirname, entryPath);
    distPath = path.resolve(__dirname, distPath);

    return {
        mode: 'development',
        target: "electron-renderer",
        entry: {
            name: [ "babel-polyfill", entryPath ]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }

                }
            ],
        },
        devtool: "source-map",
        output: {
            path: distPath,
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
        ]

    }

}

module.exports = [
    {
        mode: 'development',
        entry: {
            "chrome": [ "babel-polyfill", "./web/js/apps/chrome.js"],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                }
            ],
        },
        devtool: "source-map",
        output: {
            path: path.resolve(__dirname, 'web/dist'),
            filename: '[name]-bundle.js',
            publicPath: '/web/js/apps'
        },
        node: {
            //needed to make webpack work on chrome
            fs: 'empty'
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.$": "jquery",
                "window.jQuery": "jquery"
            })
        ]

    }

];

module.exports.push(createElectronRendererProfile("injector", "web/js/apps/injector.js", "web/dist"));
module.exports.push(createElectronRendererProfile("electron", "web/js/apps/electron.js", "web/dist"));

module.exports.push(createElectronRendererProfile("start-capture", "apps/capture/start-capture/js/entry.js", "apps/capture/start-capture/dist"));
module.exports.push(createElectronRendererProfile("progress", "apps/capture/progress/js/entry.js", "apps/capture/progress/dist"));
module.exports.push(createElectronRendererProfile("card-creator", "apps/card-creator/js/entry.js", "apps/card-creator/dist"));
module.exports.push(createElectronRendererProfile("dialog", "test/sandbox/dialog/js/entry.js", "test/sandbox/dialog/dist"));

module.exports.push(createElectronRendererProfile("webcomponents", "test/sandbox/webcomponents/js/entry.js", "test/sandbox/webcomponents/dist"));
