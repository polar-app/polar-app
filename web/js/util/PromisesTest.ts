

import {assert} from 'chai';
import {ProgressCalculator} from './ProgressCalculator';
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


