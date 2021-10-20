export namespace ESLint {

    export function create() {

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
                "react-hooks/rules-of-hooks": "error",
                "react-hooks/exhaustive-deps": "error",
                "@typescript-eslint/no-floating-promises": "error",
                "@typescript-eslint/await-thenable": "error",
                "@typescript-eslint/no-misused-promises": "error",
                "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

                "curly": "warn",
                "brace-style": "warn",
                "import/newline-after-import": "warn",
                "import/no-cycle": "warn",
                "import/no-absolute-path": "warn",

                "dot-notation": "warn",
                "no-sequences": "warn",
                "promise/param-names": "warn",
                "@typescript-eslint/ban-types": "warn",
                "camelcase": "warn",
                "node/handle-callback-err": "warn",
                "yoda": "warn",
                "one-var": "warn",
                "prefer-const": "warn",
                "prefer-regex-literals": "warn",
                "prefer-rest-params": "warn",
                "spaced-comment": "warn",
                "no-useless-return": "warn",
                "no-useless-escape": "warn",
                "no-useless-computed-key": "warn",
                "no-useless-catch": "warn",
                "no-unused-expressions": "warn",
                "no-unneeded-ternary": "warn",
                "no-undef-init": "warn",
                "no-self-compare": "warn",
                "no-return-assign": "warn",
                "no-prototype-builtins": "warn",
                "no-var": "warn",
                "no-new": "warn",
                "no-lone-blocks": "warn",
                "no-irregular-whitespace": "warn",
                "no-fallthrough": "warn",
                "no-empty": "warn",
                "no-constant-condition": "warn",
                "no-cond-assign": "warn",
                "no-case-declarations": "warn",
                "lines-between-class-members": "warn",
                "import/no-duplicates": "warn",
                "import/no-named-default": "warn",
                "@typescript-eslint/ban-ts-comment": "warn",
                "@typescript-eslint/no-empty-function": "warn",
                "@typescript-eslint/no-empty-interface": "warn",
                "@typescript-eslint/no-inferrable-types": "warn",
                "@typescript-eslint/no-unused-vars": "warn",
                "@typescript-eslint/no-var-requires": "warn",

                "@typescript-eslint/no-namespace": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "no-use-before-define": "off",
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
