// & Interfaces
export interface IPackageManifest {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    scripts?: Scripts;
    devDependencies?: Record<string, unknown>;
    dependencies?: Record<string, unknown>;
}

export interface Scripts {
    test?: string;
    "test-ci"?: string;
    mocha?: string;
    "mocha-ci"?: string;
    karma?: string;
    eslint?: string;
    "eslint-fix"?: string;
    "eslint-ci"?: string;
    compile?: string;
    watch?: string;
    tsc?: string;
    "tsc-watch"?: string;
}

export interface ICreateModuleConfig {
    readonly Typescript?: Boolean;
    readonly Mocha?: Boolean;
    readonly Karma?: Boolean;
    readonly KarmaDelete?: Boolean;
}
