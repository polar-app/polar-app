import {MemoryLogger} from "./MemoryLogger";
import {assertJSON} from "../test/Assertions";
import {SentryLogger} from './SentryLogger';

describe('SentryLogger', function() {

    xit("basic", function () {

        let sentryLogger = new SentryLogger();

        sentryLogger.error("This is a false error: ", new Error("Fake error"));

    });

});
