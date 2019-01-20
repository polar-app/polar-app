const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    // mode: 'production',
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
                // use: 'ts-loader',
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    // performance: this improved performance by about 2x.
                    // from 20s to about 10s
                    transpileOnly: true,
                    experimentalWatchApi: true,
                }
            }

        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devtool: "source-map",
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
        // new BundleAnalyzerPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery"
        })
    ],
    optimization: {
        minimize: true,
        usedExports: true,
        // removeAvailableModules: false,
        // removeEmptyChunks: false,
        // splitChunks: false,
    }

}


