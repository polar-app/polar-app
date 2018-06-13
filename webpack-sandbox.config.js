var path = require('path');

module.exports = [
    {
        mode: 'development',
        entry: {
            // import "babel-polyfill";
            schemaform: ["babel-polyfill", './sandbox/schemaform/schemaform.js'],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                }
            ],
        },
        output: {
            path: path.resolve(__dirname, 'sandbox/schemaform'),
            filename: '[name]-bundle.js',
        }
    },
    // {
    //     mode: 'development',
    //     entry: {
    //         schemaform: './sandbox/schemaform/schemaform.ts',
    //     },
    //     devtool: "source-map",
    //     resolve: {
    //         // Add '.ts' and '.tsx' as resolvable extensions.
    //         extensions: [".ts", ".tsx", ".js", ".json"]
    //     },
    //     module: {
    //         rules: [
    //             // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
    //             { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
    //
    //             // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    //             { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    //         ]
    //     },
    //     output: {
    //         path: path.resolve(__dirname, 'sandbox/schemaform'),
    //         filename: '[name]-bundle.js',
    //     }
    // },
    {
        mode: 'development',
        entry: {
            bootstrap: './sandbox/bootstrap/bootstrap.js',
        },
        output: {
            path: path.resolve(__dirname, 'sandbox/bootstrap'),
            filename: '[name]-bundle.js',
        }
    },
    {
        mode: 'development',
        entry: {
            annotations: './sandbox/annotations/annotations.js',
        },
        output: {
            path: path.resolve(__dirname, 'sandbox/annotations'),
            filename: '[name]-bundle.js',
        }
    },
    {
        mode: 'development',
        entry: {
            simplemd: './sandbox/simplemd/simplemd.js',
        },
        output: {
            path: path.resolve(__dirname, 'sandbox/simplemd'),
            filename: '[name]-bundle.js',
        }
    },
    {
        mode: 'development',
        entry: {
            contextmenu: './sandbox/jquery-contextmenu/contextmenu.js',
        },
        output: {
            path: path.resolve(__dirname, 'sandbox/jquery-contextmenu'),
            filename: '[name]-bundle.js',
        }
    },
    // {
    //     mode: 'development',
    //     entry: {
    //         editor: './sandbox/editormd/editormd.js',
    //     },
    //     output: {
    //         path: path.resolve(__dirname, 'sandbox/editormd/'),
    //         filename: '[name]-bundle.js',
    //         publicPath: 'sandbox/editormd/'
    //     }
    // },
    {
        mode: 'development',
        entry: {
            editor: './web/js/editor.js',
        },
        output: {
            path: path.resolve(__dirname, 'web/js/apps'),
            filename: '[name]-bundle.js',
            publicPath: '/web/js/apps'
        },
        node: {
            //needed to make webpack work on chrome
            fs: 'empty'
        }

    }

];
