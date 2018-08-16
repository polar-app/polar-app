import assert from 'assert';
import {Progress} from './Progress';


describe('ProgressTest', function() {

    it("Basic Progress", async function () {

        let progress = new Progress(4);

        assert.equal(progress.percentage(), 0);

        progress.incr();
        assert.equal(progress.percentage(), 25);
        progress.incr();
        progress.incr();
        progress.incr();
        assert.equal(progress.percentage(), 100);

    });

});
