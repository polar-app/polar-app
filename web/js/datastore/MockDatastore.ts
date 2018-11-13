/**
 * Datastore just in memory with no on disk persistence.
 */
import {MemoryDatastore} from './MemoryDatastore';
import {MockDocMetas} from '../metadata/DocMetas';
import {InitResult} from './Datastore';

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
