const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const svgToMiniDataURI = require('mini-svg-data-uri');

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
                    child_process: false
                }
            },

        },
    });
}
