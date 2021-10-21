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
                // ! Enabled rules ////////////////////////////////////////////////////
                // ? React Rules
                "react-hooks/rules-of-hooks": "error",
                "react-hooks/exhaustive-deps": "error",
                
                // ? TS Rules
                "@typescript-eslint/await-thenable": "error",
                "@typescript-eslint/no-misused-promises": "error",
                "@typescript-eslint/no-floating-promises": "error",
                "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

                // ! Disabled Rules ///////////////////////////////////////////////////

                // ? TS Rules

                "@typescript-eslint/ban-types": "off",
                "@typescript-eslint/no-namespace": "off",
                "@typescript-eslint/ban-ts-comment": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-empty-interface": "off",
                "@typescript-eslint/no-inferrable-types": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                

                // ? Style Rules
                "yoda": "off",
                "curly": "off",
                "camelcase": "off",
                "brace-style": "off",
                "prefer-const": "off",
                "dot-notation": "off",
                "spaced-comment": "off",
                "prefer-rest-params": "off",
                "promise/param-names": "off",
                "prefer-regex-literals": "off",
                "node/handle-callback-err": "off",
                "lines-between-class-members": "off",

                // ? Imports
                "import/no-cycle": "off",
                "import/no-duplicates": "off",
                "import/no-absolute-path": "off",
                "import/no-named-default": "off",
                "import/newline-after-import": "off",

                // ? The no(s) List
                "no-var": "off",
                "no-new": "off",
                "one-var": "off",
                "no-empty": "off",
                "no-sequences": "off",
                "no-undef-init": "off",
                "no-cond-assign": "off",
                "no-lone-blocks": "off",
                "no-fallthrough": "off",
                "no-self-compare": "off",
                "no-return-assign": "off",
                "no-useless-catch": "off",
                "no-useless-return": "off",
                "no-useless-escape": "off",
                "no-unneeded-ternary": "off",
                "no-case-declarations": "off",
                "no-use-before-define": "off",
                "no-unused-expressions": "off",
                "no-prototype-builtins": "off",
                "no-inner-declarations": "off",
                "no-constant-condition": "off",
                "no-useless-constructor": "off",
                "no-useless-computed-key": "off",
                "no-irregular-whitespace": "off",
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
