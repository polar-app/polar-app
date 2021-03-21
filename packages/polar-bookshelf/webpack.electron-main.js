// this is the main build for the electron main process and NOT the renderer
// process which has a different configuration.
const path = require('path');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');

const mode = process.env.NODE_ENV || 'production';
const isDev = mode === 'development';

const workers = os.cpus().length - 1;

console.log("Using N workers: " + workers);
console.log("mode: " + mode);
console.log("isDev: " + isDev);
console.log("Running in directory: " + __dirname);

function createRules() {

    const rules = [

        // https://github.com/webpack-contrib/cache-loader
        //
        // looks like with the cache loader the initial compile is about 10%
        // longer but 2x faster once the cache is running.
        {
            loader: 'cache-loader',
            options: {
                cacheDirectory: '.webpack-cache-loader'
            }
        },
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
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

        },
    ];

    return rules;

}

module.exports = {
    mode,
    target: "electron-main",
    entry: {
        "main": "./web/js/electron/main.ts",
    },
    module: {
        rules: createRules()
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js'],
        alias: {
        }
    },
    devtool: "source-map",
    output: {
        path: path.resolve("."),
        filename: '[name]-bundle.js',
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({})
    ],
    optimization: {
        minimize: ! isDev,
        minimizer: [new TerserPlugin({
            // disable caching to:  node_modules/.cache/terser-webpack-plugin/
            // because intellij will index this data and lock up my machine
            // and generally waste space and CPU
            cache: ".terser-webpack-plugin",
            terserOptions: {
                output: { ascii_only: true },
            }})
        ]
    }
};
