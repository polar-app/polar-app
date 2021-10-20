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
    compile?: string;
    watch?: string;
    tsc?: string;
    tscwatch?: string;
}

export interface ICreateModuleConfig {
    readonly Typescript?: 'disabled';
    readonly Mocha?: true;
    readonly Karma?: true;
}