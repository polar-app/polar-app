/* eslint-disable no-useless-escape */
import fs from 'fs';
import * as readline from 'readline';
import {Files} from "polar-shared/src/util/Files";

// & Interfaces
interface IPackageManifest {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    scripts?: Scripts;
    devDependencies?: Record<string, unknown>;
    dependencies?: Record<string, unknown>;
}

interface Scripts {
    test?: string;
    mocha?: string;
    karma?: string;
    eslint?: string;
    eslintfix?: string;
    compile?: string;
    tsc?: string;
}

interface ICreateModuleConfig {
    readonly typescript?: 'disabled';
    readonly noTests?: true;
    readonly noKarma?: true;
}

async function getUserInput(property: string): Promise<string> {
    return new Promise((resolve) => {
        const terminal: readline.Interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        terminal.question(property, (answer: string) => {
            terminal.close();
            resolve(answer);
        });
    });
}

export function createJSONDataFile(obj: any) {
    return `// THIS FILE IS AUTO-GENERATED, DO NOT EDIT\n` + JSON.stringify(obj, null, 2);
}

export async function readCreateModuleConfig(): Promise<ICreateModuleConfig> {

    const path = ".polar-create-module.json";

    if (await Files.existsAsync(path)) {
        const buff = await Files.readFileAsync(path)
        return JSON.parse(buff.toString('utf-8'));
    }

    return {};

}

async function updateScripts(): Promise<void> {

    const conf = await readCreateModuleConfig();

    async function updatePackageJSON() {

        // ~ Read and parse Package.json
        const data = await fs.promises.readFile('package.json');
        const pkg: IPackageManifest = JSON.parse(data.toString('utf-8'));

        if (! pkg.scripts) {
            // it's possible that there aren't any scripts.
            pkg.scripts = {};
        }

        // ~ Update Scripts

        if (! pkg.devDependencies) {
            pkg.devDependencies = {};
        }

        if (conf.typescript !== 'disabled') {

            // TODO we have to crank up --jobs to that we operate in parallel but some of our tests fail in this
            // scenario because they use cloud resources which act as mutex / shared state and the tests will
            // clash with one another.
            pkg.scripts.mocha = "mocha -p --reporter xunit --reporter-option output=test_results.xml --jobs=1 --timeout 60000 --exit './{,!(node_modules)/**}/*Test.js' './{,!(node_modules)/**}/*TestN.js' './{,!(node_modules)/**}/*TestNK.js'"
            pkg.scripts.eslint = "eslint -c ./.eslintrc.json .";
            pkg.scripts.eslintfix = "eslint -c ./.eslintrc.json . --fix";
            pkg.scripts.test = "RESULT=\"$(find . -name '**Test.js' -o -name '**TestN.js' -o -name '**TestNK.js' -not -path 'node_modules/*')\" && if [ -z \"$RESULT\" ]; then echo 'No tests'; else yarn run mocha; fi;";
            pkg.scripts.compile = "RESULT=\"$(find . -name '*.ts' -o -name '*.tsx' -not -path './node_modules/*' -not -name '*.d.ts*')\" && if [ -z \"$RESULT\" ]; then echo 'Nothing to Compile'; else yarn run tsc; fi;";
            pkg.scripts.tsc = 'tsc';

            if (conf.noTests) {
                pkg.scripts.test = "echo no tests";
            }

            if (conf.noKarma) {
                pkg.scripts.karma = "echo no karma";
            } else {
                pkg.scripts.karma = "RESULT=\"$(find . -name '**Test.js' -o -name '**TestK.js' -o -name '**TestNK.js' -not -path 'node_modules/*')\" && if [ -z \"$RESULT\" ]; then echo 'No tests'; else npx karma start; fi;";
                pkg.devDependencies['polar-karma'] = `${pkg.version}`;
                pkg.devDependencies['polar-webpack'] = `${pkg.version}`;
            }

            pkg.devDependencies['polar-eslint'] = `${pkg.version}`;
            pkg.devDependencies['polar-typescript'] = `${pkg.version}`;

        } else {
            delete pkg.scripts.mocha;
            delete pkg.scripts.eslint;
            delete pkg.scripts.eslintfix;
            delete pkg.scripts.test;
            delete pkg.scripts.karma;
            delete pkg.scripts.compile;

            delete pkg.devDependencies['polar-eslint'];
            delete pkg.devDependencies['polar-typescript'];
            delete pkg.devDependencies['polar-karma'];
            delete pkg.devDependencies['polar-webpack'];

        }

        // ~ Update Package.Json File
        await fs.promises.writeFile('package.json', JSON.stringify(pkg, null, 2));

    }

    await updatePackageJSON();

    // ~ copy over other files
    if (conf.typescript !== 'disabled') {
        await fs.promises.writeFile('.eslintrc.json', createJSONDataFile(ESLint.createV0()));
        await fs.promises.writeFile('tsconfig.json', createJSONDataFile(TSConfig.createV0()));
        await fs.promises.writeFile('karma.conf.js', Karma.createV0());
    } else {
        await Files.deleteAsync('.eslintrc.json');
        await Files.deleteAsync('tsconfig.json');
        await Files.deleteAsync('karma.conf.js');
    }
    if (fs.existsSync('tslint.yaml')) {
        await fs.promises.rm('tslint.yaml');
    }

}

async function createNewModule(): Promise<void> {

    const packageName: string = await getUserInput("Package Name: ");
    const packageDescription: string = await getUserInput("Package Description: ");

    await fs.promises.mkdir(`../${packageName}/src`);

    await fs.promises.writeFile('package.json', JSON.stringify(Package.createV0(packageName, packageDescription), null, '  '));

    // now we have to upgrade it so that the logic is shared
    await updateScripts();

    // ~ Return Success Message
    console.log("Package Created Successfully");

}

async function workFlow(): Promise<void> {

    // ~ Extract Cli Flags
    const cliargs: Array<string> = process.argv.slice(2);

    // ~ Incase of update only (--update)
    if (cliargs.length === 1 && cliargs[0] === '--update') {
        await updateScripts();
    } else if (cliargs.length === 0) {
        // ~ Incase of just create (no cli flags)
        await createNewModule();
    } else {
        // ~ any other incorrect flag
        console.error('Incorrect args: ', cliargs);
        process.exit(1);
    }

}

workFlow().catch(err => console.error("ERROR: Unable to create module: ", err));

export namespace ESLint {

    export function createV0() {

        return {
            "parser": "@typescript-eslint/parser",
            "parserOptions": {
                "project": "./tsconfig.json"
            },
            "extends": ["eslint:recommended", "standard", "plugin:@typescript-eslint/recommended", "prettier"],
            "plugins": ["@typescript-eslint", "react", "react-hooks"],
            "env": {
                "es6": true,
                "node": true
            },
            "rules": {
                "@typescript-eslint/no-namespace": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "no-use-before-define": "off",
                "react-hooks/rules-of-hooks": "error",
                "react-hooks/exhaustive-deps": "error",
                "curly": "warn",
                "brace-style": "warn",
                "@typescript-eslint/no-floating-promises": "error",
                "@typescript-eslint/await-thenable": "error",
                "@typescript-eslint/no-misused-promises": "error",
                "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
                "import/newline-after-import": "warn",
                "import/no-cycle": "warn",
                "import/no-absolute-path": "warn",
                "no-inner-declarations": "off",

                // burton: this should be off because Typescript supports
                // zero-code property initialization so it looks like the
                // constructor has no body when in reality it's defining
                // properties.
                "no-useless-constructor": "off",
                // "import/order": "error",
                // "indent": ["error", 4, {
                //     "FunctionDeclaration": {
                //         "parameters": "off"
                //     },
                //     "FunctionExpression": {
                //         "parameters": "off"
                //     },
                //     // "SwitchCase": 1,
                //     "outerIIFEBody": "off",
                //     "MemberExpression": "off",
                //     "CallExpression": {
                //         "arguments": "first"
                //     },
                //     "ArrayExpression": "off",
                //     "ObjectExpression": "off",
                //     // "ImportExpression": "off",
                //     "SwitchCase": 1
                // }],
                //
                // ]
                // "@typescript-eslint/adjacent-overload-signatures": "error",
                // "@typescript-eslint/array-type": [
                //     "error",
                //     {
                //         "default": "array"
                //     }
                // ],
                // "@typescript-eslint/await-thenable": "error",
                // "@typescript-eslint/ban-types": [
                //     "error",
                //     {
                //         "types": {
                //             "Object": {
                //                 "message": "Avoid using the `Object` type. Did you mean `object`?"
                //             },
                //             "Function": {
                //                 "message": "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
                //             },
                //             "Boolean": {
                //                 "message": "Avoid using the `Boolean` type. Did you mean `boolean`?"
                //             },
                //             "Number": {
                //                 "message": "Avoid using the `Number` type. Did you mean `number`?"
                //             },
                //             "String": {
                //                 "message": "Avoid using the `String` type. Did you mean `string`?"
                //             },
                //             "Symbol": {
                //                 "message": "Avoid using the `Symbol` type. Did you mean `symbol`?"
                //             }
                //         }
                //     }
                // ],
                // "@typescript-eslint/consistent-type-assertions": "off",
                // "@typescript-eslint/dot-notation": "error",
                // "@typescript-eslint/member-ordering": "off",
                // "@typescript-eslint/naming-convention": "error",
                // "@typescript-eslint/no-empty-function": "error",
                // "@typescript-eslint/no-empty-interface": "off",
                // "@typescript-eslint/no-explicit-any": "off",
                // "@typescript-eslint/no-misused-new": "error",
                // "@typescript-eslint/no-namespace": "off",
                // "@typescript-eslint/no-parameter-properties": "off",
                // "@typescript-eslint/no-unused-expressions": "error",
                // "@typescript-eslint/no-unused-vars": "error",
                // "@typescript-eslint/no-use-before-define": "off",
                // "@typescript-eslint/no-var-requires": "off",
                // "@typescript-eslint/prefer-for-of": "error",
                // "@typescript-eslint/prefer-function-type": "error",
                // "@typescript-eslint/prefer-namespace-keyword": "error",
                // "@typescript-eslint/quotes": "off",
                // "@typescript-eslint/triple-slash-reference": [
                //     "error",
                //     {
                //         "path": "always",
                //         "types": "prefer-import",
                //         "lib": "always"
                //     }
                // ],
                // "@typescript-eslint/unified-signatures": "error",
                // "arrow-parens": [
                //     "off",
                //     "always"
                // ],
                // "comma-dangle": "off",
                // "complexity": "off",
                // "constructor-super": "error",
                // "eqeqeq": [
                //     "error",
                //     "smart"
                // ],
                // "guard-for-in": "error",
                // "id-blacklist": [
                //     "error",
                //     "any",
                //     "Number",
                //     "number",
                //     "String",
                //     "string",
                //     "Boolean",
                //     "boolean",
                //     "Undefined",
                //     "undefined"
                // ],
                // "id-match": "error",
                // "import/order": "off",
                // "jsdoc/check-alignment": "error",
                // "jsdoc/check-indentation": "error",
                // "jsdoc/newline-after-description": "error",
                // "max-classes-per-file": "off",
                // "max-len": "off",
                // "new-parens": "error",
                // "no-bitwise": "error",
                // "no-caller": "error",
                // "no-cond-assign": "error",
                // "no-console": [
                //     "off",
                //     {
                //         "allow": [
                //             "warn",
                //             "dir",
                //             "timeLog",
                //             "assert",
                //             "clear",
                //             "count",
                //             "countReset",
                //             "group",
                //             "groupEnd",
                //             "table",
                //             "dirxml",
                //             "error",
                //             "groupCollapsed",
                //             "Console",
                //             "profile",
                //             "profileEnd",
                //             "timeStamp",
                //             "context"
                //         ]
                //     }
                // ],
                // "no-debugger": "error",
                // "no-empty": "error",
                // "no-eval": "error",
                // "no-fallthrough": "off",
                // "no-invalid-this": "off",
                // "no-multiple-empty-lines": "off",
                // "no-new-wrappers": "error",
                // "no-shadow": [
                //     "off",
                //     {
                //         "hoist": "all"
                //     }
                // ],
                // "no-throw-literal": "error",
                // "no-trailing-spaces": "off",
                // "no-undef-init": "error",
                // "no-underscore-dangle": "error",
                // "no-unsafe-finally": "error",
                // "no-unused-labels": "error",
                // "no-var": "error",
                // "object-shorthand": "error",
                // "one-var": [
                //     "error",
                //     "never"
                // ],
                // "prefer-arrow/prefer-arrow-functions": "off",
                // "prefer-const": "error",
                // "quote-props": "off",
                // "radix": "off",
                // "space-before-function-paren": "off",
                // "spaced-comment": [
                //     "error",
                //     "always",
                //     {
                //         "markers": [
                //             "/"
                //         ]
                //     }
                // ],
                // "use-isnan": "error",
                // "valid-typeof": "off"
            },
            "ignorePatterns": [
                "dist",
                "node_modules",
                "examples",
                "scripts",
                "*.d.ts",
                "*.js"
            ]
        };

    }

}

export namespace TSConfig {
    export function createV0() {
        return {
            "compilerOptions": {
                "incremental": true,
                "strict": true,
                "noImplicitAny": true,
                "strictNullChecks": true,
                "noImplicitThis": false,
                "alwaysStrict": true,
                "listEmittedFiles": false,
                "noImplicitReturns": true,
                "removeComments": true,
                "strictFunctionTypes": true,
                "inlineSourceMap": true,
                "inlineSources": true,
                "target": "ES2015",
                "module": "commonjs",
                "moduleResolution": "node",
                "emitDecoratorMetadata": true,
                "experimentalDecorators": true,
                "allowJs": false,
                "stripInternal": true,
                "checkJs": false,
                "jsx": "react",
                "esModuleInterop": true,
                "noUnusedLocals": false,
                "noUnusedParameters": false,
                "forceConsistentCasingInFileNames": true,
                "allowSyntheticDefaultImports": true,
                "baseUrl": ".",
                "lib": ["es2019", "es2020.string", "dom"],
                "paths": {
                    "*": ["node_modules/*"]
                },
                "skipLibCheck": true
            },
            "types": ["mocha", "reflect-metadata"],
            "include": [
                "**/*.ts",
                "**/*.tsx"
            ],
            "exclude": [
                "node_modules/**",
                "dist",
                "*.d.ts",
                "*.js",
                "cdk.out"
            ]
        }
    }
}

export namespace Package {
    export function createV0(name: string, description: string) {
        return {
            "name": name,
            "version": "0.0.0", // TODO: how do we set this now?
            "description": description,
            "scripts": {
                "test": "",
                "mocha": "",
                "eslint": "",
                "compile": ""
            },
            "author": "Polar",
            "license": "ISC"
        }

    }
}

export namespace Karma {

    // FIXME: ignore *.d.ts
    // FIXME:

    export function createV0() {

        return `
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");
const svgToMiniDataURI = require('mini-svg-data-uri');
const os = require("os");
const workers = os.cpus().length - 1;
const isDevServer = process.argv.includes('serve');
const mode = process.env.NODE_ENV || (isDevServer ? 'development' : 'production');
const isDev = mode === 'development';
const path = require("path");
const fs = require("fs");

module.exports = (config) => {
    config.set({
        client: {
            // only run tests targeting node/karma or JUST karma but never JUST
            // node.
            args: [
                './{,!(node_modules)/**}/*Test.js',
                './{,!(node_modules)/**}/*TestK.js',
                './{,!(node_modules)/**}/*TestNK.js'
            ],
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

            { pattern: 'src/**/*.ts', watched: false },

        ],
        exclude: [
          'src/**/*.d.ts'
        ],

        preprocessors: {
            // add webpack as preprocessor
            'src/**/*.ts': ['webpack'],
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
                        test: /TestN.ts$/,
                        use: [
                            {
                                loader: 'null-loader'
                            }
                        ]
                    },
                    {
                        test: /.d.ts$/,
                        use: [
                            {
                                loader: 'null-loader'
                            }
                        ]
                    },
                    {
                        test: /\.(jsx|tsx|ts)$/,
                        exclude: [
                            /node_modules/,
                            /.d.ts$/,
                            /TestN.ts$/
                        ],
                        use: [
                            {
                                loader: 'thread-loader',
                                options: {
                                    // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                                    workers,
                                    // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
                                    workerParallelJobs: 100,
                                    poolTimeout: 2000,
                                }
                            },
                            {
                                loader: 'ts-loader',
                                options: {
                                    // performance: this improved performance by about 2x.
                                    // from 20s to about 10s
                                    transpileOnly: isDev,
                                    experimentalWatchApi: true,

                                    // IMPORTANT! use happyPackMode mode to speed-up
                                    // compilation and reduce errors reported to webpack
                                    happyPackMode: true

                                }
                            }

                        ]

                    },
                    {
                        // make SVGs use data URLs.
                        test: /\\.(svg)(\\?v=\\d+\\.\\d+\\.\\d+)?$/i,
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
                    {
                        test: /\\.css$/i,
                        exclude: [],
                        use: [
                            {
                                loader: 'style-loader',
                            },
                            {
                                loader: 'css-loader'
                            }
                        ]
                    },
                    {
                        test: /\\.scss$/,
                        use: ['style-loader', 'css-loader', 'sass-loader'],
                    },
                    {
                        test: /fonts\\.googleapis\\.com\\/css/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name]-[contenthash].[ext]',
                                    outputPath: 'assets',
                                    publicPath: '/assets'
                                }
                            },
                        ],
                    },
                    {
                        // We have to use a null-loader for Electron because if we don't require()
                        // will attempt to use 'fs' which doesn't exist in the browser.
                        test: path.resolve(__dirname, '../../node_modules/electron/index.js'),
                        use: 'null-loader'
                    }

                ]

            },
            // plugins: [
            //     // ...webpackConfig.plugins,
            //     new webpack.DefinePlugin({
            //         'process.env': { NODE_ENV: JSON.stringify('development') }
            //     })
            // ],
            // entry: undefined,
            // devtool: "eval",
            resolve: {
                fallback: {
                    fs: false,
                    net: false,
                    tls: false,
                    child_process: false,
                    electron: false
                }
            },

        },
    });
}`;
    }

}
