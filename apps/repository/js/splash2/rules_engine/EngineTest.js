"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Engine_1 = require("./Engine");
const Functions_1 = require("polar-shared/src/util/Functions");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const Assertions_1 = require("../../../../../web/js/test/Assertions");
describe('Engine', function () {
    beforeEach(function () {
        TestingTime_1.TestingTime.freeze();
    });
    afterEach(function () {
        TestingTime_1.TestingTime.unfreeze();
    });
    describe('EventHandlers', function () {
        it('basic', function () {
            const myEventHandlers = {
                onFoo: Functions_1.NULL_FUNCTION
            };
            const myEventMap = Engine_1.EventMaps.create(myEventHandlers, {});
            chai_1.assert.isTrue(Preconditions_1.isPresent(myEventMap.onFoo));
            chai_1.assert.isTrue(Preconditions_1.isPresent(myEventMap.onFoo.handler));
            chai_1.assert.isTrue(myEventMap.onFoo.lastExecuted === undefined);
            myEventMap.onFoo.handler();
            chai_1.assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);
            chai_1.assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-02T11:38:49.321Z");
        });
        it('withExistingTime', function () {
            const myEventHandlers = {
                onFoo: Functions_1.NULL_FUNCTION
            };
            const myEventMap = Engine_1.EventMaps.create(myEventHandlers, { onFoo: "2012-03-01T00:00:00.000Z" });
            chai_1.assert.isTrue(Preconditions_1.isPresent(myEventMap.onFoo));
            chai_1.assert.isTrue(Preconditions_1.isPresent(myEventMap.onFoo.handler));
            chai_1.assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);
            chai_1.assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-01T00:00:00.000Z");
            myEventMap.onFoo.handler();
            chai_1.assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);
            chai_1.assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-02T11:38:49.321Z");
            Assertions_1.assertJSON(Engine_1.EventMaps.toEventTimes(myEventMap), {
                "onFoo": "2012-03-02T11:38:49.321Z"
            });
        });
    });
});
//# sourceMappingURL=EngineTest.js.map