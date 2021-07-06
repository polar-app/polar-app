
// compilation only test.
import {IWriteBatch} from "./IWriteBatch";
import {ICollectionReference} from "./ICollectionReference";

function doTest() {

    // this code just test function usage...

    const collection: ICollectionReference<unknown> = {} as any;
    const batch: IWriteBatch<unknown> = {} as any;

    const ref = collection.doc('0000');

    batch.update(ref, {
        hello: 'world'
    });

}
