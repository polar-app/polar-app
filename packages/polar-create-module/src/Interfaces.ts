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
    citest?: string;
    mocha?: string;
    cimocha?: string;
    karma?: string;
    eslint?: string;
    eslintfix?: string;
    cieslint?: string;
    compile?: string;
    watch?: string;
    tsc?: string;
    tscwatch?: string;
}

export interface ICreateModuleConfig {
    readonly Typescript?: Boolean;
    readonly Mocha?: Boolean;
    readonly Karma?: Boolean;
    readonly KarmaDelete?: Boolean;
}
