export type SourceType = 'main' | 'test';

export interface ISourceReference {

    readonly module: string;

    readonly dir: string;

    /**
     * The local path within the module
     */
    readonly modulePath: string;

    /**
     * The local path within the dir that the source is located.
     */
    readonly sourcePath: string;

    /**
     * The full path on disk of the source file.
     */
    readonly fullPath: string;

}

export interface ISourceReferenceWithType extends ISourceReference {

    readonly type: SourceType;

}
