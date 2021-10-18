import {IDStr, PathStr} from "polar-shared/src/util/Strings";

export type ModuleNameStr = IDStr;

export interface IModuleReference {

    readonly name: ModuleNameStr;

    /**
     * The root dir of the module.
     */
    readonly rootDir: PathStr;

    /**
     * The full path to the directory in the module that contains our source code.
     */
    readonly srcDir: PathStr;

}
