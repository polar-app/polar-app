const path = require('path');
const webpack = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'production';
const isDev = mode === 'development';
const target = process.env.WEBPACK_TARGET || 'web';
const devtool = isDev ? (process.env.WEBPACK_DEVTOOL || "inline-source-map") : false;

const workers = os.cpus().length - 1;

const OUTPUT_PATH = path.resolve(__dirname, 'web/dist');

console.log("Using N workers: " + workers);
console.log("mode: " + mode);
console.log("isDev: " + isDev);
console.log("target: " + target);
console.log("devtool: " + devtool);
console.log("Running in directory: " + __dirname);
console.log("Writing to output path: " + OUTPUT_PATH);

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

        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[contenthash].[ext]',
                        outputPath: 'fonts',
                        publicPath: '/web/dist/fonts'
                    }
                }
            ]
        },
        {
            test: /\.(png|jpe?g|gif|bmp|svg|ico|webp)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[contenthash].[ext]',
                        outputPath: 'images',
                        publicPath: '/web/dist/images'
                    }
                },
            ],
        },
        {
            test: /fonts\.googleapis\.com\/css/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[contenthash].[ext]',
                        outputPath: 'images',
                        publicPath: '/web/dist/images'
                    }
                },
            ],
        },
        {
            test: /\.css$/i,
            use: [
                {
                    loader: 'style-loader',
                    options: {
                        attributes: {
                            // 'data-src': '[path][name].[ext]'
                        }
                    },
                },
                {
                    loader: 'css-loader'
                }
            ]
        },
        {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        },

    ];

    if (target !== 'electron-renderer') {

        const electronPath = path.resolve(__dirname, '../../node_modules/electron/index.js')

        if (! fs.existsSync(electronPath)) {
            throw new Error("Electron dir doesn't exist: " + electronPath)
        }

        console.log("Adding null-loader for electron libraries: " + electronPath);
        rules.push({
            test: electronPath,
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
        "repository": [ "./apps/repository/js/entry.tsx"],
        "preview": [ "./apps/preview/index.ts"],
        "add-shared-doc": [ "./apps/add-shared-doc/js/index.ts"],
    },
    module: {
        rules: createRules()
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js'],
        alias: {
        }
    },
    // only inline-source-map works.
    devtool,
    output: {
        path: OUTPUT_PATH,
        filename: '[name]-bundle.js',
        // publicPath: '/web/js/apps'
    },
    node: createNode(),
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery"
        }),
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
        new CopyPlugin({
            patterns: [
                // this is a bit of a hack and it would be better if we supported
                // this better and managed as part of the build system
                { from: '../../node_modules/pdfjs-dist/web/pdf_viewer.css', to: '.'},
                { from: '../../node_modules/pdfjs-dist/build/pdf.worker.js', to: '.' }
            ],
        }),

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
