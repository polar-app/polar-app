"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatsLogger_1 = require("./StatsLogger");
const FilteredLogger_1 = require("./FilteredLogger");
const LogLevel_1 = require("./LogLevel");
const Assertions_1 = require("../test/Assertions");
describe('FilteredLogger', function () {
    it("Basic", function () {
        const statsLogger = new StatsLogger_1.StatsLogger();
        const filteredLogger = new FilteredLogger_1.FilteredLogger(statsLogger, LogLevel_1.LogLevel.INFO);
        filteredLogger.verbose("hello");
        filteredLogger.debug("hello");
        filteredLogger.info("hello");
        filteredLogger.warn("hello");
        filteredLogger.error("hello");
        filteredLogger.notice("hello");
        Assertions_1.assertJSON(statsLogger.stats, {
            "notice": 1,
            "debug": 0,
            "verbose": 0,
            "info": 1,
            "warn": 1,
            "error": 1
        });
    });
});
//# sourceMappingURL=FilteredLoggerTest.js.map