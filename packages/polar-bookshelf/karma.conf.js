// TODO: do not run the karma-typescript directly.
// instead run npx tsc --watch and then have these run under chrome so I can
// watch the output.
//

module.exports = (config) => {
    config.set({
        browsers: ['Chrome'],
        // browsers: ['ChromeHeadless'],
        frameworks: ['mocha', 'karma-typescript'],
        files: [
            { pattern: 'apps/**/*.ts', watched: false },
            { pattern: 'web/**/*.ts', watched: false },
        ],
        exclude: [
            'apps/**/*.d.ts',
            'apps/**/*Test.ts',
            'web/**/*.d.ts',
            'web/**/*Test.ts'
        ],

        preprocessors: {
            'apps/**/*.ts': ['karma-typescript'],
            'web/**/*.ts': ['karma-typescript'],
        },

        reporters: ["dots", "karma-typescript"],

        singleRun: true,

        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json",
            bundlerOptions: {
                transforms: [
                    require("karma-typescript-es6-transform")()
                ]
            }
        },
    });
};
