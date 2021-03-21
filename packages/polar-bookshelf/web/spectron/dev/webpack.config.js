const merge = require('webpack-merge');
const libpath = require('path');
const config = require('../../../webpack.config.js');

const newConfig = merge(config, {
    entry: {
        "content": [ libpath.resolve(__dirname, "./content.tsx") ],
    },
    mode: 'development',
    target: 'electron-renderer',
    output: {
        path: libpath.resolve(__dirname, 'web/dist')
    },
    // devServer: {
    //     contentBase: path.join(__dirname, 'dist'),
    //     compress: true,
    //     port: 9000
    // }
})

console.log("config: ", config);

console.log("New config: ", newConfig);

module.exports = newConfig;
