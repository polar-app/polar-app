const path = require('path');
const webpack = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');

const mode = process.env.NODE_ENV || 'production';
const isDev = mode === 'development';
const target = process.env.WEBPACK_TARGET || 'web';

const workers = os.cpus().length - 1;

const OUTPUT_PATH = path.resolve(__dirname, 'web/dist');

console.log("Using N workers: " + workers);
console.log("mode: " + mode);
console.log("isDev: " + isDev);
console.log("target: " + target);
console.log("Running in directory: " + __dirname);
console.log("Writing to output path: " + OUTPUT_PATH);

function createRules() {

    const rules = [

        // https://github.com/webpack-contrib/cache-loader
        //
        // looks like with the cache loader the initial compile is about 10%
        // longer but 2x faster once the cache is running.
        { loader: 'cache-loader' },
        {
            test: /\.tsx?$/,
            // exclude: /node_modules/,

            use: [
                {
                    loader: 'thread-loader',
                    options: {
                        // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                        workers,
                        // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
                        workerParallelJobs: 100,
                        poolTimeout: 2000,
                    }
                },
                {
                    loader: 'ts-loader',
                    options: {
                        // performance: this improved performance by about 2x.
                        // from 20s to about 10s
                        transpileOnly: true,
                        experimentalWatchApi: true,

                        // IMPORTANT! use happyPackMode mode to speed-up
                        // compilation and reduce errors reported to webpack
                        happyPackMode: true

                    }
                }

            ]

        }

    ];

    if (target !== 'electron-renderer') {
        console.log("Adding null-loader for electron libraries");
        rules.push({
            test: path.resolve(__dirname, 'node_modules/electron/index.js'),
            use: 'null-loader'
        })
    }

    return rules;

}

function createNode() {

    if (target === 'electron-renderer') {
        return {};
    } else {
        return {
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
        }
    }

}

module.exports = {
    mode,
    // stats: 'verbose',
    target,
    entry: {

        "doc": [ "./apps/doc/src/entry.tsx"],
        "repository": [ "./apps/repository/js/entry.tsx"],
        "preview": [ "./apps/preview/index.ts"],
        // "login": [ "./apps/repository/js/login.ts"],
        "add-shared-doc": [ "./apps/add-shared-doc/js/index.ts"],

    },
    module: {
        rules: createRules()
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
        }
    },
    // only inline-source-map works.
    devtool: isDev ? "inline-source-map" : false,
    output: {
        path: OUTPUT_PATH,
        filename: '[name]-bundle.js',
        // publicPath: '/web/js/apps'
    },
    node: createNode(),
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery"
        }),
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })

    ],
    optimization: {
        minimize: ! isDev,
        minimizer: [new TerserPlugin({
            terserOptions: {
                output: { ascii_only: true },
            }})
        ],
        // usedExports: true,
        // removeAvailableModules: true,
        // removeEmptyChunks: true,
        // splitChunks: {
        //     chunks: 'all'
        // },
    },
    devServer: {
        publicPath: 'web/dist',
        contentBase: path.join(__dirname, '.'),
        compress: true,
        port: 443,
        watchContentBase: true,
        host: 'localapp.getpolarized.io'
    }

};
