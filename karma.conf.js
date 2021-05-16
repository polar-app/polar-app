module.exports = (config) => {
    config.set({
        // browsers: ['Chrome'],
        browsers: ['ChromeHeadless'],
        frameworks: ['mocha', 'karma-typescript'],
        files: [
            // all files ending in "_test"
            { pattern: 'web/**/*Karma.ts', watched: false },
            // each file acts as entry point for the webpack configuration
        ],

        preprocessors: {
            'apps/**/*.ts': ['karma-typescript'],
            'web/**/*.ts': ['karma-typescript'],
        },

        reporters: ["dots", "karma-typescript"],

        singleRun: true,

        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json"
        },
    });
};
