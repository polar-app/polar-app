module.exports = (config) => {
    config.set({
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

        frameworks: ['mocha', 'karma-typescript'],
        files: [
            // all files ending in "_test"
            { pattern: 'src/**/*.ts', watched: false },
            { pattern: 'src/**/*.tsx', watched: false },
        ],

        preprocessors: {
            'src/**/*.ts': ['karma-typescript'],
            'src/**/*.tsx': ['karma-typescript'],
        },

        reporters: ["dots", "karma-typescript"],

        singleRun: true,
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json",
            bundlerOptions: {
                acornOptions: {
                    ecmaVersion: 8,
                },
                transforms: [
                    require("karma-typescript-es6-transform")({
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-transform-spread',
                            '@babel/plugin-transform-classes',
                            '@babel/plugin-proposal-object-rest-spread'
                        ],
                        // presets: [
                        //     ["@babel/preset-env", {
                        //         // targets: {
                        //         //     browsers: ["last 2 Chrome versions"]
                        //         // }
                        //     }]
                        // ]
                        // presets: [
                        //     ["@babel/preset-env", {
                        //         targets: {
                        //             chrome: '60'
                        //         },
                        //     }]
                        // ]
                        // presets: ["es2015", "react"]
                        presets: [
                            ["@babel/preset-env", {
                                targets: {
                                    chrome: '60'
                                },
                            }]
                        ]

                    })
                ]
            }
        },
    });
};
