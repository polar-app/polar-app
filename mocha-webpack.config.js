var nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node', // webpack should compile node compatible code
    mode: "development",
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    devtool: "inline-source-map",
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
};
