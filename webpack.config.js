const path = require('path');
const webpack = require('webpack');

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

    {
        mode: 'development',
        target: "electron-renderer",
        entry: {
            "capture": [ "babel-polyfill", "./apps/capture/js/entry.js"]
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
            path: path.resolve(__dirname, 'dist'),
            filename: '[name]-bundle.js',
        }

    }

];
