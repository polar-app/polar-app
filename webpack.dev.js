const merge = require('webpack-merge');
const libpath = require('path');
const config = require('./webpack.config.js');

const newConfig = merge(config, {
    entry: {
        // "repository": "./apps/repository/js/entry.tsx",
        // "preview": [ "./apps/preview/index.ts"],
        "dev": "./apps/dev/index.ts",
        // "add-shared-doc": [ "./apps/add-shared-doc/js/index.ts"],
    },
    mode: 'development',
    target: 'web',
    devtool: 'sourcemap',
    optimization: {
        minimize: false
    }
})

console.log("config: ", config);

console.log("New config: ", newConfig);

module.exports = newConfig;
