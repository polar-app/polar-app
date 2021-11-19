/**
 * main: a main source file which is just regular code.
 * test: a unit test of a main source file
 * entry: an entrypoint to the system where we start classifying code
 * exclude: an exclude that we do not index as part of the system
 */
export type SourceType = 'main' | 'test' | 'entry' | 'exclude';

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
