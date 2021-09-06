import fs from 'fs';
import * as readline from 'readline';

// & Interfaces
interface PackageJson {
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
    eslint?: string;
    eslintfix: string;
    compile?: string;
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

    return `// THIS FILE IS AUTO-GENERATED, DO NOT EDIT\n\n` + JSON.stringify(obj, null, "  ");

}

async function updateScripts(): Promise<void> {

    async function updatePackageJSON() {

        // ~ Read and parse Package.json
        const data = await fs.promises.readFile('package.json');
        const content = JSON.parse(data.toString('utf-8'));

        // ~ Update Scripts
        content.scripts.test = "if [ -z $(find src -name '**Test.js') ]; then echo 'No tests'; else yarn run mocha; fi;";
        content.scripts.mocha = "mocha --timeout 20000 --exit **/**/*Test.js"
        content.scripts.eslint = "eslint -c ./.eslintrc.json .";
        content.scripts.eslintfix = "eslint -c ./.eslintrc.json . --fix";
        content.scripts.compile = "tsc";

        // ~ Update Package.Json File
        await fs.promises.writeFile('package.json', JSON.stringify(content, null, 2));

    }

    await updatePackageJSON();

    // ~ copy over other files
    await fs.promises.writeFile('.eslintrc.json', createJSONDataFile(ESLint.createV0()));
    await fs.promises.writeFile('tsconfig.json', createJSONDataFile(TSConfig.createV0()));

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

workFlow()
    .catch(err => console.error("ERROR: Unable to create module: ", err));

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
                "curly": "error",
                "brace-style": "error",
                "@typescript-eslint/no-floating-promises": "error",
                "@typescript-eslint/await-thenable": "error",
                "@typescript-eslint/no-misused-promises": "error",
                "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
                "import/newline-after-import": "error",
                "import/no-cycle": "error",
                "import/no-absolute-path": "error"
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
            "ignorePatterns": ["dist", "node_modules", "examples", "scripts", "*.d.ts", "*.js", "web/js", "apps"]
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
                }
            },
            "types": ["mocha", "reflect-metadata"],
            "include": ["**/*.ts", "**/*.tsx"],
            "exclude": ["node_modules", "dist", "*.d.ts", "*.js", "cdk.out"]
        }
    }
}

export namespace Package {
    export function createV0(name: string, description: string) {
        return {
            "name": name,
            "version": "2.1.107", // TODO: how do we set this now?
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
