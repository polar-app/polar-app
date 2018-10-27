import {assert} from "chai";
import {DiskDatastore} from './DiskDatastore';
import {DatastoreFiles} from "./DatastoreFiles";

describe('DastastoreFiles', function() {

    it("valid file names for attachments", async function() {

        assert.ok(DatastoreFiles.isValidFileName('test.jpg'));
        assert.ok(DatastoreFiles.isValidFileName('test.html'));
        assert.ok(DatastoreFiles.isValidFileName('abc124ABC.txt'));
        assert.ok(DatastoreFiles.isValidFileName('abc124ABC'));

        assert.ok(! DatastoreFiles.isValidFileName('test this.jpg'));
        assert.ok(! DatastoreFiles.isValidFileName('testthis.jpggg'));

    });

});
