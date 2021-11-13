import {IStorageReference} from "./IStorageReference";

export interface IStorage {

    readonly ref: (path?: string) => IStorageReference;

}
