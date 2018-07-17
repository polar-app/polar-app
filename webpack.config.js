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
            "card-creator": [ "babel-polyfill", "./web/js/apps/card-creator.js"]
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
