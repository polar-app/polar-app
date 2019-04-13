import {assert} from "chai";
import {FirebaseDatastore} from './FirebaseDatastore';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {DiskDatastore} from './DiskDatastore';
import {Datastores} from './Datastores';
import {PersistenceLayers} from './PersistenceLayers';
import {MemoryDatastore} from './MemoryDatastore';
import {MockDocMetas} from '../metadata/DocMetas';
import {PersistenceLayer} from './PersistenceLayer';
import {UUIDs} from "../metadata/UUIDs";
import {TestingTime} from "../test/TestingTime";
import {DelegatedDatastore} from './DelegatedDatastore';

describe('TracedDatastore', function() {

    it("basic", async function() {

        console.log("FIXME");

        // const keys = Object.keys(DelegatedDatastore);

        // Reflect.own

        // Reflect.getMetadata(DelegatedDatastore);

        console.log(Object.keys(Reflect));

        const datastore = new DiskDatastore();

        // const keys = Reflect.getMetadataKeys(datastore);
        //
        // console.log(keys);

    });

});
