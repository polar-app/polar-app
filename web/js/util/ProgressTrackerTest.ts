import {assert} from 'chai';
import {Progress} from './Progress';
import {ProgressTrackers} from './ProgressTrackers';
import {ProgressTracker} from './ProgressTracker';


describe('ProgressTracker', function() {

    it("Basic", async function() {

        const progressTracker = new ProgressTracker(1);
        progressTracker.incr();
        const progress = progressTracker.peek();

        assert.equal(progress.progress, 100);

    });

});
