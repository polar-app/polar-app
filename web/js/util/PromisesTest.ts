

import {assert} from 'chai';
import {Progress} from './Progress';
import {ProgressTrackers} from './ProgressTrackers';
import {ProgressTracker} from './ProgressTracker';


describe('Promises', function() {

    it("Basic", async function() {

        async function isTypescriptSane(): Promise<boolean> {
            return false;
        }

        if (isTypescriptSane()) {
            console.log("No... it's insane!");
        }

    });

});


