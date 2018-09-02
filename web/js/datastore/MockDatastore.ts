/**
 * Datastore just in memory with no on disk persistence.
 */
import {MemoryDatastore} from './MemoryDatastore';
import {MockDocMetas} from '../metadata/DocMetas';

export class MockDatastore extends MemoryDatastore {

    constructor() {
        super();
    }

    async init() {

        await super.init();

        let mockDockMetas = [
            MockDocMetas.createWithinInitialPagemarks('0x001', 1),
            MockDocMetas.createWithinInitialPagemarks('0x002', 2)
        ];

    }

}
