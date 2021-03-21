/**
 * Datastore just in memory with no on disk persistence.
 */
import {MemoryDatastore} from './MemoryDatastore';
import {MockDocMetas} from '../metadata/DocMetas';
import {InitResult} from './Datastore';
import {DocFileMeta} from "polar-shared/src/datastore/DocFileMeta";
import { Backend } from 'polar-shared/src/datastore/Backend';
import { FileRef } from 'polar-shared/src/datastore/FileRef';
import {
    GetFileOpts,
    ReadableBinaryDatastore
} from "polar-shared/src/datastore/IDatastore";

export class MockDatastore extends MemoryDatastore {

    constructor() {
        super();
    }

    public async init(): Promise<InitResult> {

        const result = await super.init();

        const mockDockMetas = [
            MockDocMetas.createWithinInitialPagemarks('0x001', 1),
            MockDocMetas.createWithinInitialPagemarks('0x002', 2)
        ];

        return result;

    }

}

export class MockReadableBinaryDatastore implements ReadableBinaryDatastore {


    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return false;
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {
        throw new Error("noop");
    }



}
