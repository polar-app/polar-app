var nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node', // webpack should compile node compatible code
    mode: "development",
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};
