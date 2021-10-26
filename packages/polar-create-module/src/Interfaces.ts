// & Interfaces
export interface IPackageManifest {
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly author: string;
    readonly license: string;
    readonly scripts?: Scripts;
    readonly devDependencies?: Record<string, unknown>;
    readonly dependencies?: Record<string, unknown>;
}

export interface Scripts {
    readonly test?: string;
    readonly citest?: string;
    readonly mocha?: string;
    readonly cimocha?: string;
    readonly karma?: string;
    readonly eslint?: string;
    readonly eslintfix?: string;
    readonly compile?: string;
    readonly watch?: string;
    readonly tsc?: string;
    readonly tscwatch?: string;
}

export interface ICreateModuleConfig {
    readonly Typescript?: 'disabled';
    readonly Mocha?: true;
    readonly Karma?: true;
}
