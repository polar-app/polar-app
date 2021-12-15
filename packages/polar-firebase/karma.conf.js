const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const svgToMiniDataURI = require('mini-svg-data-uri');
const os = require("os");
const workers = os.cpus().length - 1;
const isDevServer = process.argv.includes('serve');
const mode = process.env.NODE_ENV || (isDevServer ? 'development' : 'production');
const isDev = mode === 'development';

function parseArgs() {

    const result = {};

    for (const arg of process.argv) {
        if (arg.startsWith("--grep=")) {
            result.grep = arg.split("=")[1];
        }
    }

    return result;

}

function getFiles() {
    const fs = require('fs');
    const path = require("path");

    function isDirectory(path) {
        return fs.existsSync(path);
    }

    const filesConfig = [];
    if (isDirectory(path.resolve(__dirname, 'src'))) {
        filesConfig.push({pattern: './src/**/*.ts', watched: false});
    }
    if (isDirectory(path.resolve(__dirname, 'apps'))) {
        filesConfig.push({pattern: './apps/**/*TestK.ts', watched: false});
        filesConfig.push({pattern: './apps/**/*TestNK.ts', watched: false});
        filesConfig.push({pattern: './apps/**/*TestK.tsx', watched: false});
    }
    if (isDirectory(path.resolve(__dirname, 'web'))) {
        filesConfig.push({pattern: './web/**/*TestK.ts', watched: false});
        filesConfig.push({pattern: './web/**/*TestNK.ts', watched: false});
        filesConfig.push({pattern: './web/**/*TestK.tsx', watched: false});
    }
    return filesConfig;
}

const {grep} = parseArgs();

module.exports = (config) => {
    config.set({
        client: {
            // only run tests targeting node/karma or JUST karma but never JUST
            // node.
            args: [
                './{,!(node_modules)/**}/*Test.js',
                './{,!(node_modules)/**}/*TestK.js',
                './{,!(node_modules)/**}/*TestNK.js'
            ],
            mocha: {

                timeout: 60000,

                // this works to to filter mocha but I have no way to get this value from the command line.
                // https://www.npmjs.com/package/karma-mocha
                //
                // karma doesn't have a native way to filter results so we have
                // to pass --grep and handle it here.
                grep

            }
        },
        browsers: ['ChromeHeadless'],

        customHeaders: [
            {
                match: '.*',
                name: 'Cross-Origin-Opener-Policy',
                value: 'same-origin'
            },
            {
                match: '.*',
                name: 'Cross-Origin-Embedder-Policy',
                value: 'require-corp',
            }
        ],

        // make sure to include webpack as a framework
        frameworks: ['mocha', 'webpack'],

        plugins: [
            'karma-chrome-launcher',
            'karma-webpack',
            'karma-mocha',
            'karma-spec-reporter',
            'karma-junit-reporter',
            'karma-summary-reporter'
        ],

        files: getFiles(),
        exclude: [
            // Exclude TS declaration files
            './**/*.d.ts'
        ],

        preprocessors: {
            // add webpack as preprocessor
            '**/*': ['webpack'],
        },
        singleRun: true,

        reporters: ['junit', 'spec', 'summary'],

        captureTimeout: 120000,
        browserNoActivityTimeout: 120000,
        summaryReporter: {
            // 'failed', 'skipped' or 'all'
            show: 'all',
            // Limit the spec label to this length
            specLength: 60,
            // Show an 'all' column as a summary
            overviewColumn: true,
            // Show a list of test clients, 'always', 'never' or 'ifneeded'
            browserList: 'always'
        },
        webpack: {
            plugins: [
                new NodePolyfillPlugin(),
            ],
            module: {
                rules: [
                    {
                        test: /TestN.ts$/,
                        use: [
                            {
                                loader: 'null-loader'
                            }
                        ]
                    },
                    {
                        test: /.d.ts$/,
                        use: [
                            {
                                loader: 'null-loader'
                            }
                        ]
                    },
                    {
                        test: /.(jsx|tsx|ts)$/,
                        exclude: [
                            /node_modules/,
                            /.d.ts$/,
                            /TestN.ts$/
                        ],
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
                                    transpileOnly: isDev,
                                    experimentalWatchApi: true,
                                    // IMPORTANT! use happyPackMode mode to speed-up
                                    // compilation and reduce errors reported to webpack
                                    happyPackMode: true
                                }
                            }
                        ]

                    },
                    {
                        test: /\.(png|jpe?g|gif|bmp|ico|webp|woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
                        exclude: [],
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name]-[contenthash].[ext]',
                                    outputPath: 'assets',
                                    publicPath: '/assets'
                                }
                            },
                        ],
                    },
                    {
                        // make SVGs use data URLs.
                        test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/i,
                        exclude: [],
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 32768,
                                    generator: (content) => svgToMiniDataURI(content.toString()),
                                }
                            },
                        ],
                    },
                    {
                        test: /\.css$/i,
                        exclude: [],
                        use: [
                            {
                                loader: 'style-loader',
                            },
                            {
                                loader: 'css-loader'
                            }
                        ]
                    },
                    {
                        test: /\.scss$/,
                        use: ['style-loader', 'css-loader', 'sass-loader', 'sass'],
                    },
                    {
                        test: /fonts\.googleapis\.com\/css/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name]-[contenthash].[ext]',
                                    outputPath: 'assets',
                                    publicPath: '/assets'
                                }
                            },
                        ],
                    },
                    {
                        // We have to use a null-loader for Electron because if we don't require()
                        // will attempt to use 'fs' which doesn't exist in the browser.
                        test: /\/electron\/index.js$/,
                        use: 'null-loader'
                    }
                ]
            },
            // plugins: [
            //     // ...webpackConfig.plugins,
            //     new webpack.DefinePlugin({
            //         'process.env': { NODE_ENV: JSON.stringify('development') }
            //     })
            // ],
            // entry: undefined,
            // devtool: "eval",
            resolve: {
                fallback: {
                    fs: false,
                    net: false,
                    tls: false,
                    child_process: false,
                    electron: false
                }
            },
        },
    });
}
