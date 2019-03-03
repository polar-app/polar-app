import {assert} from 'chai';
import {ProgressTracker} from './ProgressTracker';
import {Platform, Platforms} from './Platforms';

describe('Platforms', function() {

    it("toSymbol", async function() {

        assert.equal("WINDOWS", Platforms.toSymbol(Platform.WINDOWS));
        assert.equal("LINUX",  Platforms.toSymbol(Platform.LINUX));

        console.log("Current platform: " + Platforms.toSymbol(Platforms.get()));

    });

});
