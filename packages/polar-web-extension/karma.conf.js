const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const svgToMiniDataURI = require('mini-svg-data-uri');
const os = require("os");
const workers = os.cpus().length - 1;
const isDevServer = process.argv.includes('serve');
const mode = process.env.NODE_ENV || (isDevServer ? 'development' : 'production');
const isDev = mode === 'development';

module.exports = (config) => {
    config.set({
        client: {
            mocha: {
                timeout : 60000
            }
        },
        // browsers: ['Chrome'],
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
            'karma-junit-reporter'
        ],

        files: [

            { pattern: 'src/**/*TestK.ts', watched: false },

        ],

        preprocessors: {
            // add webpack as preprocessor
            'src/**/*TestK.ts': ['webpack'],
        },
        singleRun: true,

        reporters: ['junit', 'spec'],

        webpack: {
            plugins: [
                new NodePolyfillPlugin(),
            ],
            module: {
                rules: [
                    {
                        test: /\.(jsx|tsx|ts)$/,
                        exclude: [
                            /node_modules/,
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

                ]

            },
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
