import {IDStr, PathStr} from "polar-shared/src/util/Strings";

export type ModuleNameStr = IDStr;

export interface IModuleReference {

    readonly name: ModuleNameStr;

    /**
     * The root dir of the module.
     */
    readonly rootDir: PathStr;

    /**
     * This is going to be the src dir
     */
    readonly dir: PathStr;

}
