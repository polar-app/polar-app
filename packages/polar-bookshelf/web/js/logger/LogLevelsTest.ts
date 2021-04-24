import {LogLevel} from './LogLevel';

import {assert} from 'chai';
import {LogLevels} from './LogLevels';

describe('LogLevels', function() {

    it("reverse LogLevel", function () {
        assert.equal(LogLevels.fromName('INFO'), LogLevel.INFO)
    });

    it("invalid", function () {
        assert.throws(() => LogLevels.fromName('wrong-name'))
    });

});
