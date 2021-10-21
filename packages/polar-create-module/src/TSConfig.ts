export namespace TSConfig {
    export function create() {
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