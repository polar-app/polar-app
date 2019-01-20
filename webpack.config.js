const path = require('path');
const webpack = require('webpack');

module.exports = [
    {
        mode: 'production',
        entry: {
            "chrome": [ "./web/js/apps/chrome.ts"],
        },
        module: {

            rules: [
                {
                    test: path.resolve(__dirname, 'node_modules/electron/index.js'),
                    use: 'null-loader'
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        // devtool: "source-map",
        output: {
            path: path.resolve(__dirname, 'web/dist'),
            filename: '[name]-bundle.js',
            publicPath: '/web/js/apps'
        },
        node: {
            //needed to make webpack work on chrome
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.$": "jquery",
                "window.jQuery": "jquery"
            })
        ],
        optimization: {
            minimize: false
        }

    }

];
