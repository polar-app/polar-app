const webpackConfig = require("./webpack.config");

// if (process.env.CIRCLECI === 'true') {
//    console.log("Setting up CHROME_BIN for circleci");
//    process.env.CHROME_BIN = require('puppeteer').executablePath();
// }

// TODO: do not run the karma-typescript directly.
// instead run npx tsc --watch and then have these run under chrome so I can
// watch the output.
//

module.exports = (config) => {
  config.set({
    // ... normal karma configuration
    client: {
      mocha: {
        timeout : 15000
      }
    },
    // browsers: ['Chrome'],
    browsers: ['ChromeHeadless'],

    // make sure to include webpack as a framework
    frameworks: ['mocha', 'webpack'],

    plugins: [
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-mocha',
    ],

    files: [
      // { pattern: 'web/js/**/*Test.ts', watched: false },
      // { pattern: 'apps/**/*Test.ts', watched: false },
      // { pattern: 'web/**/*Test.ts', watched: false },
      { pattern: 'apps/**/*Test.ts', watched: false },

      // TODO: looks like this won't work because jsdom won't compile in webpack
      // due to child_process.

      // { pattern: 'web/**/*Test.ts', watched: false },
      { pattern: 'apps/**/*Karma.ts', watched: false },
      { pattern: 'web/**/*Karma.ts', watched: false },

    ],

    preprocessors: {
      // add webpack as preprocessor
      'apps/**/*.ts': ['webpack'],
      'web/**/*.ts': ['webpack'],
    },
    singleRun: true,

    webpack: {
      // karma watches the test entry points
      // Do NOT specify the entry option
      // webpack watches dependencies

      // webpack configuration
      ...webpackConfig,
      entry: undefined,
      devtool: "eval",
    },
  });
}
