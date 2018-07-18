const path = require('path');
const webpack = require('webpack');

function createElectronRendererProfile(name, entryPath, distPath) {

    entryPath = path.resolve(__dirname, entryPath);
    distPath = path.resolve(__dirname, distPath);

    return {
        mode: 'development',
        target: "electron-renderer",
        entry: {
            name: [ "babel-polyfill", entryPath]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                    // tell babel to NOT use .babelrc so we can define our
                    // configuration here.  then tell it modules:false per
                    //
                    // https://insights.untapt.com/webpack-import-require-and-you-3fd7f5ea93c0

                }
            ],
        },
        devtool: "source-map",
        output: {
            path: distPath,
            filename: `${name}-bundle.js`,
        }

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

    },
    {
        mode: 'development',
        target: "electron-renderer",
        entry: {
            "electron": ["babel-polyfill", "./web/js/apps/electron.js"],
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
        }

    },
    {
        mode: 'development',
        entry: {
            injector: ["./web/js/apps/injector.js"]
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
        }
    },

];

module.exports.push(createElectronRendererProfile("start-capture", "apps/capture/start-capture/js/entry.js", "apps/capture/start-capture/dist"));
module.exports.push(createElectronRendererProfile("progress", "apps/capture/progress/js/entry.js", "apps/capture/progress/dist"));
module.exports.push(createElectronRendererProfile("card-creator", "apps/card-creator/js/entry.js", "apps/card-creator/dist"));
