import {StatsLogger} from './StatsLogger';
import {FilteredLogger} from './FilteredLogger';
import {LogLevel} from './LogLevel';
import {assertJSON} from '../test/Assertions';

describe('FilteredLogger', function() {

    it("Basic", function () {

        let statsLogger = new StatsLogger();

        let filteredLogger = new FilteredLogger(statsLogger, LogLevel.INFO);

        filteredLogger.verbose("hello")
        filteredLogger.debug("hello")
        filteredLogger.info("hello")
        filteredLogger.warn("hello")
        filteredLogger.error("hello")

        assertJSON(statsLogger.stats, {
                 "debug": 0,
                 "verbose": 0,
                 "info": 1,
                 "warn": 1,
                 "error": 1
             }
        );

    });

});
