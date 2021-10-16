import {IDStr, PathStr} from "polar-shared/src/util/Strings";

export type ModuleNameStr = IDStr;

export interface IModuleReference {
    readonly name: ModuleNameStr;
    readonly dir: PathStr;
}
