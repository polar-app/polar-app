export namespace TSConfig {
    export function create() {
        return {
            "extends": "../../tsconfig.json",
            "types": [
              "mocha",
              "reflect-metadata"
            ],
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
