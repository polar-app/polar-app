"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Proxies_1 = require("./Proxies");
const Assertions_1 = require("../test/Assertions");
const Objects_1 = require("../util/Objects");
const Symbol_1 = require("../metadata/Symbol");
describe('Proxies', function () {
    describe('paths', function () {
        it("work with paths directly", function () {
            let myDict = {
                cars: {
                    "mazda6": {
                        borrowed: false
                    }
                }
            };
            const myTraceListener = new MyTraceListener();
            myDict = Proxies_1.Proxies.create(myDict, myTraceListener);
            myDict.cars.mazda6.borrowed = true;
            const expected = [
                {
                    "path": "/cars/mazda6",
                    "mutationType": "SET",
                    "target": {
                        "borrowed": true
                    },
                    "property": "borrowed",
                    "value": true,
                    "previousValue": false,
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(myTraceListener.mutations, expected);
        });
    });
    describe('traceListeners', function () {
        it("default as object", function () {
            let myDict = {
                cat: "leo"
            };
            const myTraceListener = new MyTraceListener();
            myDict = Proxies_1.Proxies.create(myDict, myTraceListener);
            myDict.cat = "monster";
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(myTraceListener.mutations, expected);
        });
        it("default as function", function () {
            let myDict = {
                cat: "leo"
            };
            const mutations = [];
            const traceListener = myDict = Proxies_1.Proxies.create(myDict, (traceEvent) => {
                mutations.push(Objects_1.Objects.duplicate(traceEvent));
            });
            myDict.cat = "monster";
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(mutations, expected);
        });
        it("addListener as object", function () {
            let myDict = {
                cat: "leo"
            };
            const myTraceListener = new MyTraceListener();
            myDict = Proxies_1.Proxies.create(myDict, () => {
            });
            myDict.addTraceListener(myTraceListener);
            myDict.cat = "monster";
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(myTraceListener.mutations, expected);
        });
        it("addListener as function", function () {
            let myDict = {
                cat: "leo"
            };
            myDict = Proxies_1.Proxies.create(myDict, function () {
            });
            const mutations = [];
            myDict.addTraceListener((traceEvent) => {
                mutations.push(Objects_1.Objects.duplicate(traceEvent));
            });
            myDict.cat = "monster";
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(mutations, expected);
        });
    });
    describe('deepTrace', function () {
        xit("shared object reference", function () {
            const address = {
                street: "101 Fake Street",
                city: "San Francisco",
                state: "California"
            };
            let myDict = {
                alice: {
                    address
                },
                bob: {
                    address
                }
            };
            const myTraceListener = new MyTraceListener();
            myDict = Proxies_1.Proxies.create(myDict, myTraceListener);
            myDict.alice.address.city = "Oakland";
            chai_1.assert.equal(myDict.alice.address.city, "Oakland");
            chai_1.assert.equal(myDict.bob.address.city, "Oakland");
            const expected = [];
            Assertions_1.assertJSON(myTraceListener.mutations, expected);
        });
        it("deep tracing", function () {
            let myDict = { 'foo': 'bar' };
            const myTraceListener = new MyTraceListener();
            myDict = Proxies_1.Proxies.create(myDict, myTraceListener);
            myDict.foo = 'frog';
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "frog"
                    },
                    "property": "foo",
                    "value": "frog",
                    "previousValue": "bar",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(myTraceListener.mutations, expected);
        });
        it("deep tracing with nested path", function () {
            let myDict = {
                foo: 'bar',
                cat: {
                    name: "leo"
                }
            };
            const myTraceListener = new MyTraceListener();
            myDict = Proxies_1.Proxies.create(myDict, myTraceListener);
            myDict.cat.name = "monster";
            const expected = [
                {
                    "path": "/cat",
                    "mutationType": "SET",
                    "target": {
                        "name": "monster"
                    },
                    "property": "name",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(myTraceListener.mutations, expected);
        });
        it("mutation of all fields", function () {
            let myDict = {
                foo: 'bar',
                cat: {
                    name: "leo"
                }
            };
            const myTraceListener = new MyTraceListener();
            myDict = Proxies_1.Proxies.create(myDict, myTraceListener);
            myDict.foo = "cat";
            myDict.cat.name = "monster";
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "cat",
                        "cat": {
                            "name": "leo"
                        }
                    },
                    "property": "foo",
                    "value": "cat",
                    "previousValue": "bar",
                    "mutationState": "PRESENT"
                },
                {
                    "path": "/cat",
                    "mutationType": "SET",
                    "target": {
                        "name": "monster"
                    },
                    "property": "name",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(myTraceListener.mutations, expected);
        });
        it("as function", function () {
            let myDict = { 'foo': 'bar' };
            const mutations = [];
            myDict = Proxies_1.Proxies.create(myDict, (traceEvent) => {
                mutations.push(Objects_1.Objects.duplicate(traceEvent));
            });
            myDict.foo = 'frog';
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "frog"
                    },
                    "property": "foo",
                    "value": "frog",
                    "previousValue": "bar",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(mutations, expected);
        });
        it("as nested dictionaries", function () {
            let myDict = {
                'pages': {
                    1: {
                        marked: true
                    },
                    2: {
                        marked: false
                    },
                }
            };
            const mutations = [];
            myDict = Proxies_1.Proxies.create(myDict, function (traceEvent) {
                mutations.push(Objects_1.Objects.duplicate(traceEvent));
            });
            myDict.pages[1].marked = false;
            const expected = [
                {
                    "path": "/pages/1",
                    "mutationType": "SET",
                    "target": {
                        "marked": false
                    },
                    "property": "marked",
                    "value": false,
                    "previousValue": true,
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(mutations, expected);
        });
        it("add listener to object", function () {
            let myDict = {
                "cat": "dog"
            };
            myDict = Proxies_1.Proxies.create(myDict, function (traceEvent) {
            });
            const mutations = [];
            myDict.addTraceListener((traceEvent) => {
                mutations.push(Objects_1.Objects.duplicate(traceEvent));
            });
            myDict.asdf = "bar";
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "dog",
                        "asdf": "bar"
                    },
                    "property": "asdf",
                    "value": "bar",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(mutations, expected);
        });
        it("fire initial values", function () {
            let myDict = {
                "cat": "dog"
            };
            const mutations = [];
            myDict = Proxies_1.Proxies.create(myDict, (traceEvent) => {
            });
            myDict.addTraceListener((traceEvent) => {
                mutations.push(traceEvent);
            }).sync();
            const expected = [
                {
                    "path": "/",
                    "mutationType": "INITIAL",
                    "target": {
                        "cat": "dog"
                    },
                    "property": "cat",
                    "value": "dog",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(mutations, expected);
        });
        xit("modify nested value with listener at root", function () {
            let myDict = {};
            const mutations = [];
            myDict = Proxies_1.Proxies.create(myDict, function (traceEvent) {
            });
            myDict.addTraceListener((traceEvent) => {
                mutations.push(traceEvent);
            });
            myDict.car = {};
            myDict.car.type = "mazda";
            const expected = [];
            Assertions_1.assertJSON(mutations, expected);
        });
        it("delete value", function () {
            let myDict = {
                "cat": "dog"
            };
            const mutations = [];
            myDict = Proxies_1.Proxies.create(myDict, function (traceEvent) {
                mutations.push(traceEvent);
            });
            delete myDict.cat;
            const expected = [
                {
                    "path": "/",
                    "mutationType": "DELETE",
                    "target": {},
                    "property": "cat",
                    "previousValue": "dog",
                    "mutationState": "ABSENT"
                }
            ];
            chai_1.assert.equal(mutations[0].previousValue, "dog");
            chai_1.assert.equal(mutations[0].value === undefined, true);
            chai_1.assert.equal("value" in mutations[0], true);
            Assertions_1.assertJSON(mutations, expected);
        });
        it("make sure value actually replaced", function () {
            let myDict = {
                "cat": "leo"
            };
            myDict = Proxies_1.Proxies.create(myDict, function (traceEvent) {
                return true;
            });
            myDict.cat = "monster";
            chai_1.assert.equal(myDict.cat, "monster");
        });
        it("add object to existing traced object and expect mutation events", function () {
            let myDict = {
                "rootPrimitiveValue": "dog"
            };
            const mutations = [];
            myDict = Proxies_1.Proxies.create(myDict, function (traceEvent) {
                mutations.push(Objects_1.Objects.duplicate(traceEvent));
            });
            chai_1.assert.equal(myDict.__path, "/");
            myDict.depth0 = {};
            myDict.depth0.depth1 = {};
            myDict.depth0.depth2 = {
                deepPrimitiveValue: "cat"
            };
            myDict.depth0.depth2.setPrimitiveValue = "red";
            chai_1.assert.equal(myDict.__traceListeners.length, 1);
            chai_1.assert.equal(myDict.depth0.__traceListeners.length, 1);
            chai_1.assert.equal(myDict.depth0.depth1.__traceListeners.length, 1);
            chai_1.assert.equal(myDict.depth0.__path, "/depth0");
            chai_1.assert.equal(myDict.depth0.depth1.__path, "/depth0/depth1");
            chai_1.assert.equal(mutations.length, 4);
            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "rootPrimitiveValue": "dog",
                        "depth0": {}
                    },
                    "property": "depth0",
                    "value": {},
                    "mutationState": "PRESENT"
                },
                {
                    "path": "/depth0",
                    "mutationType": "SET",
                    "target": {
                        "depth1": {}
                    },
                    "property": "depth1",
                    "value": {},
                    "mutationState": "PRESENT"
                },
                {
                    "path": "/depth0",
                    "mutationType": "SET",
                    "target": {
                        "depth1": {},
                        "depth2": {
                            "deepPrimitiveValue": "cat"
                        }
                    },
                    "property": "depth2",
                    "value": {
                        "deepPrimitiveValue": "cat"
                    },
                    "mutationState": "PRESENT"
                },
                {
                    "path": "/depth0/depth2",
                    "mutationType": "SET",
                    "target": {
                        "deepPrimitiveValue": "cat",
                        "setPrimitiveValue": "red"
                    },
                    "property": "setPrimitiveValue",
                    "value": "red",
                    "mutationState": "PRESENT"
                }
            ];
            Assertions_1.assertJSON(mutations, expected);
        });
    });
    describe('deepTrace', function () {
        it("test with object.Freeze", function () {
            const TYPE = Object.freeze({
                MAMMAL: new Symbol_1.Symbol("MAMMAL"),
                MARSUPIAL: new Symbol_1.Symbol("MARSUPIAL")
            });
            let myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };
            const mutations = [];
            myDict = Proxies_1.Proxies.create(myDict, (traceEvent) => {
                mutations.push(traceEvent);
            });
            delete myDict.foo;
            const expected = [
                {
                    "path": "/",
                    "mutationType": "DELETE",
                    "target": {
                        "cat": {
                            "type": "MAMMAL"
                        },
                        "dog": {
                            "type": "MAMMAL"
                        }
                    },
                    "property": "foo",
                    "mutationState": "ABSENT"
                }
            ];
            Assertions_1.assertJSON(mutations, expected, undefined, true);
        });
        it("test symbols used twice...", function () {
            const TYPE = Object.freeze({
                MAMMAL: new Symbol_1.Symbol("MAMMAL"),
                MARSUPIAL: new Symbol_1.Symbol("MARSUPIAL")
            });
            let myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };
            Proxies_1.Proxies.create(myDict);
            myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };
            Proxies_1.Proxies.create(myDict);
        });
    });
});
class MyTraceListener {
    constructor() {
        this.mutations = [];
    }
    onMutation(traceEvent) {
        this.mutations.push(Objects_1.Objects.duplicate(traceEvent));
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJveGllc1Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJQcm94aWVzVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtCQUE0QjtBQUM1Qix1Q0FBa0M7QUFDbEMsbURBQThDO0FBRzlDLDZDQUF3QztBQUN4QywrQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUVoQixRQUFRLENBQUMsT0FBTyxFQUFFO1FBRWQsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1lBSTNCLElBQUksTUFBTSxHQUFHO2dCQUNULElBQUksRUFBRTtvQkFDRixRQUFRLEVBQUU7d0JBQ04sUUFBUSxFQUFFLEtBQUs7cUJBQ2xCO2lCQUNKO2FBQ0osQ0FBQztZQUVGLE1BQU0sZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7WUFFOUMsTUFBTSxHQUFHLGlCQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztZQUVqRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBRW5DLE1BQU0sUUFBUSxHQUFHO2dCQUNiO29CQUNJLE1BQU0sRUFBRSxjQUFjO29CQUN0QixjQUFjLEVBQUUsS0FBSztvQkFDckIsUUFBUSxFQUFFO3dCQUNOLFVBQVUsRUFBRSxJQUFJO3FCQUNuQjtvQkFDRCxVQUFVLEVBQUUsVUFBVTtvQkFDdEIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsZUFBZSxFQUFFLEtBQUs7b0JBQ3RCLGVBQWUsRUFBRSxTQUFTO2lCQUM3QjthQUNKLENBQUM7WUFFRix1QkFBVSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFcEQsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQU92QixFQUFFLENBQUMsbUJBQW1CLEVBQUU7WUFFcEIsSUFBSSxNQUFNLEdBQUc7Z0JBQ1QsR0FB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Z0JBQ2QsR0FBRyxFQUFFO29CQUNELElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDcEI7Z0JBQ0QsR0FBRyxFQUFFO29CQUNELElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDcEI7YUFDSixDQUFDO1lBR0YsaUJBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdkIsTUFBTSxHQUFHO2dCQUNMLEdBQUcsRUFBRTtvQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ3BCO2dCQUNELEdBQUcsRUFBRTtvQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ3BCO2FBQ0osQ0FBQztZQUVGLGlCQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNCLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sZUFBZTtJQUFyQjtRQUVXLGNBQVMsR0FBaUIsRUFBRSxDQUFDO0lBUXhDLENBQUM7SUFOVSxVQUFVLENBQUMsVUFBc0I7UUFFcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsaUJBQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNuRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBRUoiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7UHJveGllc30gZnJvbSAnLi9Qcm94aWVzJztcbmltcG9ydCB7YXNzZXJ0SlNPTn0gZnJvbSAnLi4vdGVzdC9Bc3NlcnRpb25zJztcbmltcG9ydCB7VHJhY2VMaXN0ZW5lcn0gZnJvbSAnLi9UcmFjZUxpc3RlbmVyJztcbmltcG9ydCB7VHJhY2VFdmVudH0gZnJvbSAnLi9UcmFjZUV2ZW50JztcbmltcG9ydCB7T2JqZWN0c30gZnJvbSAnLi4vdXRpbC9PYmplY3RzJztcbmltcG9ydCB7U3ltYm9sfSBmcm9tICcuLi9tZXRhZGF0YS9TeW1ib2wnO1xuXG5kZXNjcmliZSgnUHJveGllcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgZGVzY3JpYmUoJ3BhdGhzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoXCJ3b3JrIHdpdGggcGF0aHMgZGlyZWN0bHlcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgcGF0aCBpcyByaWdodC4uLlxuXG4gICAgICAgICAgICBsZXQgbXlEaWN0ID0ge1xuICAgICAgICAgICAgICAgIGNhcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJtYXpkYTZcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9ycm93ZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBteVRyYWNlTGlzdGVuZXIgPSBuZXcgTXlUcmFjZUxpc3RlbmVyKCk7XG5cbiAgICAgICAgICAgIG15RGljdCA9IFByb3hpZXMuY3JlYXRlKG15RGljdCwgbXlUcmFjZUxpc3RlbmVyKTtcblxuICAgICAgICAgICAgbXlEaWN0LmNhcnMubWF6ZGE2LmJvcnJvd2VkID0gdHJ1ZTtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvY2Fycy9tYXpkYTZcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblR5cGVcIjogXCJTRVRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJib3Jyb3dlZFwiOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJib3Jyb3dlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwicHJldmlvdXNWYWx1ZVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblN0YXRlXCI6IFwiUFJFU0VOVFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgYXNzZXJ0SlNPTihteVRyYWNlTGlzdGVuZXIubXV0YXRpb25zLCBleHBlY3RlZCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd0cmFjZUxpc3RlbmVycycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIHVuZm9ydHVuYXRlbHkgLCB0aGVyZSBhcmUgNCB0eXBlcyB3ZSBoYXZlIHRvIHRlc3RcbiAgICAgICAgLy9cbiAgICAgICAgLy8gdGhlIGRlZmF1bHQgKGZ1bmN0aW9uIG9yIG9iamVjdClcbiAgICAgICAgLy8gYWRkaXRpb25hbCAoZnVuY3Rpb24gb3Igb2JqZWN0KS5cblxuICAgICAgICBpdChcImRlZmF1bHQgYXMgb2JqZWN0XCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBsZXQgbXlEaWN0ID0ge1xuICAgICAgICAgICAgICAgIGNhdDogXCJsZW9cIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgbXlUcmFjZUxpc3RlbmVyID0gbmV3IE15VHJhY2VMaXN0ZW5lcigpO1xuXG4gICAgICAgICAgICBteURpY3QgPSBQcm94aWVzLmNyZWF0ZShteURpY3QsIG15VHJhY2VMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIG15RGljdC5jYXQgPSBcIm1vbnN0ZXJcIjtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2F0XCI6IFwibW9uc3RlclwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJjYXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm1vbnN0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcmV2aW91c1ZhbHVlXCI6IFwibGVvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25TdGF0ZVwiOiBcIlBSRVNFTlRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGFzc2VydEpTT04obXlUcmFjZUxpc3RlbmVyLm11dGF0aW9ucywgZXhwZWN0ZWQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiZGVmYXVsdCBhcyBmdW5jdGlvblwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbGV0IG15RGljdCA9IHtcbiAgICAgICAgICAgICAgICBjYXQ6IFwibGVvXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG11dGF0aW9uczogVHJhY2VFdmVudFtdID0gW107XG5cbiAgICAgICAgICAgIGNvbnN0IHRyYWNlTGlzdGVuZXIgPVxuXG4gICAgICAgICAgICBteURpY3QgPSBQcm94aWVzLmNyZWF0ZShteURpY3QsICh0cmFjZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25zLnB1c2goT2JqZWN0cy5kdXBsaWNhdGUodHJhY2VFdmVudCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG15RGljdC5jYXQgPSBcIm1vbnN0ZXJcIjtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2F0XCI6IFwibW9uc3RlclwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJjYXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm1vbnN0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcmV2aW91c1ZhbHVlXCI6IFwibGVvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25TdGF0ZVwiOiBcIlBSRVNFTlRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGFzc2VydEpTT04obXV0YXRpb25zLCBleHBlY3RlZCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJhZGRMaXN0ZW5lciBhcyBvYmplY3RcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBteURpY3Q6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBjYXQ6IFwibGVvXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG15VHJhY2VMaXN0ZW5lciA9IG5ldyBNeVRyYWNlTGlzdGVuZXIoKTtcblxuICAgICAgICAgICAgbXlEaWN0ID0gUHJveGllcy5jcmVhdGUobXlEaWN0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gbm9vcFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG15RGljdC5hZGRUcmFjZUxpc3RlbmVyKG15VHJhY2VMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIG15RGljdC5jYXQgPSBcIm1vbnN0ZXJcIjtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2F0XCI6IFwibW9uc3RlclwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJjYXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm1vbnN0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcmV2aW91c1ZhbHVlXCI6IFwibGVvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25TdGF0ZVwiOiBcIlBSRVNFTlRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGFzc2VydEpTT04obXlUcmFjZUxpc3RlbmVyLm11dGF0aW9ucywgZXhwZWN0ZWQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiYWRkTGlzdGVuZXIgYXMgZnVuY3Rpb25cIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBteURpY3Q6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBjYXQ6IFwibGVvXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG15RGljdCA9IFByb3hpZXMuY3JlYXRlKG15RGljdCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gbm9vcFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG11dGF0aW9uczogVHJhY2VFdmVudFtdID0gW107XG5cbiAgICAgICAgICAgIG15RGljdC5hZGRUcmFjZUxpc3RlbmVyKCh0cmFjZUV2ZW50OiBUcmFjZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25zLnB1c2goT2JqZWN0cy5kdXBsaWNhdGUodHJhY2VFdmVudCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG15RGljdC5jYXQgPSBcIm1vbnN0ZXJcIjtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2F0XCI6IFwibW9uc3RlclwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJjYXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm1vbnN0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcmV2aW91c1ZhbHVlXCI6IFwibGVvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25TdGF0ZVwiOiBcIlBSRVNFTlRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGFzc2VydEpTT04obXV0YXRpb25zLCBleHBlY3RlZCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdkZWVwVHJhY2UnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgc2hhcmVkIG9iamVjdCByZWZlcmVuY2UsIG1ha2Ugc3VyZSB3ZSByZWNlaXZlIHR3byBldmVudHNcbiAgICAgICAgLy8gZm9yIGl0LCBvbmUgYXQgZWFjaCBwYXRoLlxuICAgICAgICB4aXQoXCJzaGFyZWQgb2JqZWN0IHJlZmVyZW5jZVwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgYWRkcmVzcyA9IHtcbiAgICAgICAgICAgICAgICBzdHJlZXQ6IFwiMTAxIEZha2UgU3RyZWV0XCIsXG4gICAgICAgICAgICAgICAgY2l0eTogXCJTYW4gRnJhbmNpc2NvXCIsXG4gICAgICAgICAgICAgICAgc3RhdGU6IFwiQ2FsaWZvcm5pYVwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgbXlEaWN0ID0ge1xuICAgICAgICAgICAgICAgIGFsaWNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3NcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJvYjoge1xuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgbXlUcmFjZUxpc3RlbmVyID0gbmV3IE15VHJhY2VMaXN0ZW5lcigpO1xuXG4gICAgICAgICAgICBteURpY3QgPSBQcm94aWVzLmNyZWF0ZShteURpY3QsIG15VHJhY2VMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIG15RGljdC5hbGljZS5hZGRyZXNzLmNpdHkgPSBcIk9ha2xhbmRcIjtcblxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKG15RGljdC5hbGljZS5hZGRyZXNzLmNpdHksIFwiT2FrbGFuZFwiKTtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChteURpY3QuYm9iLmFkZHJlc3MuY2l0eSwgXCJPYWtsYW5kXCIpO1xuXG4gICAgICAgICAgICAvLyBGSVhNRTogdGhpcyBpcyBicm9rZW4uLiB3ZSBjaGFuZ2UgdGhlIHZhbHVlIGluIHR3byBwbGFjZXMgYnV0XG4gICAgICAgICAgICAvLyBvbmx5IGZpcmUgb25lIGV2ZW50IGxpc3RlbmVyLi4gIEknbSBnb2luZyB0byBoYXZlIHRvIHJldGhpbmsgdGhlXG4gICAgICAgICAgICAvLyB3YXkgSSdtIGRvaW5nIGV2ZW50cyBmb3IgdGhpcyB0byB3b3JrLlxuXG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZDogVHJhY2VFdmVudFtdID0gW1xuXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBhc3NlcnRKU09OKG15VHJhY2VMaXN0ZW5lci5tdXRhdGlvbnMsIGV4cGVjdGVkKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImRlZXAgdHJhY2luZ1wiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbGV0IG15RGljdCA9IHsnZm9vJzogJ2Jhcid9O1xuXG4gICAgICAgICAgICBjb25zdCBteVRyYWNlTGlzdGVuZXIgPSBuZXcgTXlUcmFjZUxpc3RlbmVyKCk7XG5cbiAgICAgICAgICAgIG15RGljdCA9IFByb3hpZXMuY3JlYXRlKG15RGljdCwgbXlUcmFjZUxpc3RlbmVyKTtcblxuICAgICAgICAgICAgbXlEaWN0LmZvbyA9ICdmcm9nJztcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9vXCI6IFwiZnJvZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJmb29cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImZyb2dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcmV2aW91c1ZhbHVlXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25TdGF0ZVwiOiBcIlBSRVNFTlRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGFzc2VydEpTT04obXlUcmFjZUxpc3RlbmVyLm11dGF0aW9ucywgZXhwZWN0ZWQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiZGVlcCB0cmFjaW5nIHdpdGggbmVzdGVkIHBhdGhcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBteURpY3QgPSB7XG4gICAgICAgICAgICAgICAgZm9vOiAnYmFyJyxcbiAgICAgICAgICAgICAgICBjYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJsZW9cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG15VHJhY2VMaXN0ZW5lciA9IG5ldyBNeVRyYWNlTGlzdGVuZXIoKTtcblxuICAgICAgICAgICAgbXlEaWN0ID0gUHJveGllcy5jcmVhdGUobXlEaWN0LCBteVRyYWNlTGlzdGVuZXIpO1xuXG4gICAgICAgICAgICBteURpY3QuY2F0Lm5hbWUgPSBcIm1vbnN0ZXJcIjtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvY2F0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1vbnN0ZXJcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnR5XCI6IFwibmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwibW9uc3RlclwiLFxuICAgICAgICAgICAgICAgICAgICBcInByZXZpb3VzVmFsdWVcIjogXCJsZW9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblN0YXRlXCI6IFwiUFJFU0VOVFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgYXNzZXJ0SlNPTihteVRyYWNlTGlzdGVuZXIubXV0YXRpb25zLCBleHBlY3RlZCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJtdXRhdGlvbiBvZiBhbGwgZmllbGRzXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBsZXQgbXlEaWN0ID0ge1xuICAgICAgICAgICAgICAgIGZvbzogJ2JhcicsXG4gICAgICAgICAgICAgICAgY2F0OiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwibGVvXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBteVRyYWNlTGlzdGVuZXIgPSBuZXcgTXlUcmFjZUxpc3RlbmVyKCk7XG5cbiAgICAgICAgICAgIG15RGljdCA9IFByb3hpZXMuY3JlYXRlKG15RGljdCwgbXlUcmFjZUxpc3RlbmVyKTtcblxuICAgICAgICAgICAgbXlEaWN0LmZvbyA9IFwiY2F0XCI7XG4gICAgICAgICAgICBteURpY3QuY2F0Lm5hbWUgPSBcIm1vbnN0ZXJcIjtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9vXCI6IFwiY2F0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNhdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibGVvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBcImZvb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiY2F0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHJldmlvdXNWYWx1ZVwiOiBcImJhclwiLFxuICAgICAgICAgICAgICAgICAgICBcIm11dGF0aW9uU3RhdGVcIjogXCJQUkVTRU5UXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJwYXRoXCI6IFwiL2NhdFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm11dGF0aW9uVHlwZVwiOiBcIlNFVFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJtb25zdGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIm1vbnN0ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcmV2aW91c1ZhbHVlXCI6IFwibGVvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25TdGF0ZVwiOiBcIlBSRVNFTlRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGFzc2VydEpTT04obXlUcmFjZUxpc3RlbmVyLm11dGF0aW9ucywgZXhwZWN0ZWQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiYXMgZnVuY3Rpb25cIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBteURpY3QgPSB7J2Zvbyc6ICdiYXInfTtcblxuICAgICAgICAgICAgY29uc3QgbXV0YXRpb25zOiBUcmFjZUV2ZW50W10gPSBbXTtcblxuICAgICAgICAgICAgbXlEaWN0ID0gUHJveGllcy5jcmVhdGUobXlEaWN0LCAodHJhY2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIG11dGF0aW9ucy5wdXNoKE9iamVjdHMuZHVwbGljYXRlKHRyYWNlRXZlbnQpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBteURpY3QuZm9vID0gJ2Zyb2cnO1xuXG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwicGF0aFwiOiBcIi9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblR5cGVcIjogXCJTRVRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb29cIjogXCJmcm9nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBcImZvb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiZnJvZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInByZXZpb3VzVmFsdWVcIjogXCJiYXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblN0YXRlXCI6IFwiUFJFU0VOVFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgYXNzZXJ0SlNPTihtdXRhdGlvbnMsIGV4cGVjdGVkKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImFzIG5lc3RlZCBkaWN0aW9uYXJpZXNcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBteURpY3QgPSB7XG4gICAgICAgICAgICAgICAgJ3BhZ2VzJzoge1xuICAgICAgICAgICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgMjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG11dGF0aW9uczogVHJhY2VFdmVudFtdID0gW107XG5cbiAgICAgICAgICAgIG15RGljdCA9IFByb3hpZXMuY3JlYXRlKG15RGljdCwgZnVuY3Rpb24odHJhY2VFdmVudCkge1xuICAgICAgICAgICAgICAgIG11dGF0aW9ucy5wdXNoKE9iamVjdHMuZHVwbGljYXRlKHRyYWNlRXZlbnQpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBteURpY3QucGFnZXNbMV0ubWFya2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJwYXRoXCI6IFwiL3BhZ2VzLzFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblR5cGVcIjogXCJTRVRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYXJrZWRcIjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBcIm1hcmtlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcInByZXZpb3VzVmFsdWVcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblN0YXRlXCI6IFwiUFJFU0VOVFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgLy8gbWFrZSBhIHBhdHRlcm4gb2YgL3BhZ2VzL1tpbnRdL2ZvbyBzbyB0aGF0IHdlIGNhbiBsaXN0ZW4gdG8gdGhlXG4gICAgICAgICAgICAvLyBzdHJlYW0gb2Ygb2JqZWN0cyBhbmQgdGhlbiBoYW5kbGUgdGhlIHJpZ2h0IG9uZS5cblxuICAgICAgICAgICAgYXNzZXJ0SlNPTihtdXRhdGlvbnMsIGV4cGVjdGVkKTtcblxuICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgaXQoXCJhZGQgbGlzdGVuZXIgdG8gb2JqZWN0XCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBsZXQgbXlEaWN0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgXCJjYXRcIjogXCJkb2dcIlxuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICBteURpY3QgPSBQcm94aWVzLmNyZWF0ZShteURpY3QsIGZ1bmN0aW9uKHRyYWNlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBub29wXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgbXV0YXRpb25zOiBUcmFjZUV2ZW50W10gPSBbXTtcblxuICAgICAgICAgICAgbXlEaWN0LmFkZFRyYWNlTGlzdGVuZXIoKHRyYWNlRXZlbnQ6IFRyYWNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBtdXRhdGlvbnMucHVzaChPYmplY3RzLmR1cGxpY2F0ZSh0cmFjZUV2ZW50KSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbXlEaWN0LmFzZGYgPSBcImJhclwiO1xuXG4gICAgICAgICAgICAvLyBtYWtlIGEgcGF0dGVybiBvZiAvcGFnZXMvW2ludF0vZm9vIHNvIHRoYXQgd2UgY2FuIGxpc3RlbiB0byB0aGVcbiAgICAgICAgICAgIC8vIHN0cmVhbSBvZiBvYmplY3RzIGFuZCB0aGVuIGhhbmRsZSB0aGUgcmlnaHQgb25lLlxuXG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwicGF0aFwiOiBcIi9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblR5cGVcIjogXCJTRVRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjYXRcIjogXCJkb2dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXNkZlwiOiBcImJhclwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJhc2RmXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJiYXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblN0YXRlXCI6IFwiUFJFU0VOVFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgYXNzZXJ0SlNPTihtdXRhdGlvbnMsIGV4cGVjdGVkKTtcblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGl0KFwiZmlyZSBpbml0aWFsIHZhbHVlc1wiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbGV0IG15RGljdDogYW55ID0ge1xuICAgICAgICAgICAgICAgIFwiY2F0XCI6IFwiZG9nXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG11dGF0aW9uczogVHJhY2VFdmVudFtdID0gW107XG5cbiAgICAgICAgICAgIG15RGljdCA9IFByb3hpZXMuY3JlYXRlKG15RGljdCwgKHRyYWNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBub29wXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbXlEaWN0LmFkZFRyYWNlTGlzdGVuZXIoKHRyYWNlRXZlbnQ6IFRyYWNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBtdXRhdGlvbnMucHVzaCh0cmFjZUV2ZW50KTtcbiAgICAgICAgICAgIH0pLnN5bmMoKTtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiSU5JVElBTFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNhdFwiOiBcImRvZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJjYXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImRvZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm11dGF0aW9uU3RhdGVcIjogXCJQUkVTRU5UXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBhc3NlcnRKU09OKG11dGF0aW9ucywgZXhwZWN0ZWQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIG91ciBldmVudCBsaXN0ZW5lciBkZXNpZ24gaXMgYnJva2VuLi4gdGhlIGZpcnN0IGxpc3RlbmVyIGlzXG4gICAgICAgIC8vIHJlY3Vyc2l2ZS4uIGJ1dCBub3QgTkVXIGxpc3RlbmVycy4uLlxuICAgICAgICB4aXQoXCJtb2RpZnkgbmVzdGVkIHZhbHVlIHdpdGggbGlzdGVuZXIgYXQgcm9vdFwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbGV0IG15RGljdDogYW55ID0ge1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgbXV0YXRpb25zOiBUcmFjZUV2ZW50W10gPSBbXTtcblxuICAgICAgICAgICAgbXlEaWN0ID0gUHJveGllcy5jcmVhdGUobXlEaWN0LCBmdW5jdGlvbih0cmFjZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gbm9vcFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG15RGljdC5hZGRUcmFjZUxpc3RlbmVyKCh0cmFjZUV2ZW50OiBUcmFjZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25zLnB1c2godHJhY2VFdmVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbXlEaWN0LmNhciA9IHt9O1xuXG4gICAgICAgICAgICBteURpY3QuY2FyLnR5cGUgPSBcIm1hemRhXCI7XG5cbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkOiBUcmFjZUV2ZW50W10gPSBbXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBhc3NlcnRKU09OKG11dGF0aW9ucywgZXhwZWN0ZWQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiZGVsZXRlIHZhbHVlXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBsZXQgbXlEaWN0ID0ge1xuICAgICAgICAgICAgICAgIFwiY2F0XCI6IFwiZG9nXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG11dGF0aW9uczogVHJhY2VFdmVudFtdID0gW107XG5cbiAgICAgICAgICAgIG15RGljdCA9IFByb3hpZXMuY3JlYXRlKG15RGljdCwgZnVuY3Rpb24odHJhY2VFdmVudCkge1xuICAgICAgICAgICAgICAgIG11dGF0aW9ucy5wdXNoKHRyYWNlRXZlbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlbGV0ZSBteURpY3QuY2F0O1xuXG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwicGF0aFwiOiBcIi9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblR5cGVcIjogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge30sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJjYXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcmV2aW91c1ZhbHVlXCI6IFwiZG9nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25TdGF0ZVwiOiBcIkFCU0VOVFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKCBtdXRhdGlvbnNbMF0ucHJldmlvdXNWYWx1ZSwgXCJkb2dcIik7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoIG11dGF0aW9uc1swXS52YWx1ZSA9PT0gdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbCggXCJ2YWx1ZVwiIGluIG11dGF0aW9uc1swXSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGFzc2VydEpTT04obXV0YXRpb25zLCBleHBlY3RlZCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJtYWtlIHN1cmUgdmFsdWUgYWN0dWFsbHkgcmVwbGFjZWRcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBteURpY3QgPSB7XG4gICAgICAgICAgICAgICAgXCJjYXRcIjogXCJsZW9cIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbXlEaWN0ID0gUHJveGllcy5jcmVhdGUobXlEaWN0LCBmdW5jdGlvbih0cmFjZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbXlEaWN0LmNhdCA9IFwibW9uc3RlclwiO1xuXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoIG15RGljdC5jYXQsIFwibW9uc3RlclwiKTtcblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGl0KFwiYWRkIG9iamVjdCB0byBleGlzdGluZyB0cmFjZWQgb2JqZWN0IGFuZCBleHBlY3QgbXV0YXRpb24gZXZlbnRzXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBsZXQgbXlEaWN0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgXCJyb290UHJpbWl0aXZlVmFsdWVcIjogXCJkb2dcIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgbXV0YXRpb25zOiBUcmFjZUV2ZW50W10gPSBbXTtcblxuICAgICAgICAgICAgbXlEaWN0ID0gUHJveGllcy5jcmVhdGUobXlEaWN0LCBmdW5jdGlvbih0cmFjZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25zLnB1c2goT2JqZWN0cy5kdXBsaWNhdGUodHJhY2VFdmVudCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFzc2VydC5lcXVhbCggbXlEaWN0Ll9fcGF0aCwgXCIvXCIgKTtcblxuICAgICAgICAgICAgLy8gdGhpcyBzaG91bGQgdHJpZ2dlciBhIG5ldyBoYW5kbGVyIHRvIGJlIGFkZGVkXG4gICAgICAgICAgICBteURpY3QuZGVwdGgwID0ge1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBteURpY3QuZGVwdGgwLmRlcHRoMSA9IHtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbXlEaWN0LmRlcHRoMC5kZXB0aDIgPSB7XG4gICAgICAgICAgICAgICAgZGVlcFByaW1pdGl2ZVZhbHVlOiBcImNhdFwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBub3cgYWRkIG1vcmUgZGF0YSB0byB0aGUgZ29yaWxsYS5cblxuICAgICAgICAgICAgbXlEaWN0LmRlcHRoMC5kZXB0aDIuc2V0UHJpbWl0aXZlVmFsdWUgPSBcInJlZFwiO1xuXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoIG15RGljdC5fX3RyYWNlTGlzdGVuZXJzLmxlbmd0aCwgMSApO1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKCBteURpY3QuZGVwdGgwLl9fdHJhY2VMaXN0ZW5lcnMubGVuZ3RoLCAxICk7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoIG15RGljdC5kZXB0aDAuZGVwdGgxLl9fdHJhY2VMaXN0ZW5lcnMubGVuZ3RoLCAxICk7XG5cbiAgICAgICAgICAgIGFzc2VydC5lcXVhbCggbXlEaWN0LmRlcHRoMC5fX3BhdGgsIFwiL2RlcHRoMFwiICk7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoIG15RGljdC5kZXB0aDAuZGVwdGgxLl9fcGF0aCwgXCIvZGVwdGgwL2RlcHRoMVwiICk7XG5cbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChtdXRhdGlvbnMubGVuZ3RoLCA0KTtcblxuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicm9vdFByaW1pdGl2ZVZhbHVlXCI6IFwiZG9nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlcHRoMFwiOiB7fVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnR5XCI6IFwiZGVwdGgwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjoge30sXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25TdGF0ZVwiOiBcIlBSRVNFTlRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCIvZGVwdGgwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibXV0YXRpb25UeXBlXCI6IFwiU0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVwdGgxXCI6IHt9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJkZXB0aDFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblN0YXRlXCI6IFwiUFJFU0VOVFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwicGF0aFwiOiBcIi9kZXB0aDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblR5cGVcIjogXCJTRVRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXB0aDFcIjoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlcHRoMlwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWVwUHJpbWl0aXZlVmFsdWVcIjogXCJjYXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnR5XCI6IFwiZGVwdGgyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWVwUHJpbWl0aXZlVmFsdWVcIjogXCJjYXRcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcIm11dGF0aW9uU3RhdGVcIjogXCJQUkVTRU5UXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJwYXRoXCI6IFwiL2RlcHRoMC9kZXB0aDJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblR5cGVcIjogXCJTRVRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWVwUHJpbWl0aXZlVmFsdWVcIjogXCJjYXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2V0UHJpbWl0aXZlVmFsdWVcIjogXCJyZWRcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnR5XCI6IFwic2V0UHJpbWl0aXZlVmFsdWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInJlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm11dGF0aW9uU3RhdGVcIjogXCJQUkVTRU5UXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBhc3NlcnRKU09OKG11dGF0aW9ucywgZXhwZWN0ZWQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZGVlcFRyYWNlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoXCJ0ZXN0IHdpdGggb2JqZWN0LkZyZWV6ZVwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgVFlQRSA9IE9iamVjdC5mcmVlemUoe1xuICAgICAgICAgICAgICAgIE1BTU1BTDogbmV3IFN5bWJvbChcIk1BTU1BTFwiKSxcbiAgICAgICAgICAgICAgICBNQVJTVVBJQUw6IG5ldyBTeW1ib2woXCJNQVJTVVBJQUxcIilcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgbXlEaWN0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgY2F0OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFRZUEUuTUFNTUFMXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkb2c6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogVFlQRS5NQU1NQUxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgbXV0YXRpb25zOiBUcmFjZUV2ZW50W10gPSBbXTtcblxuICAgICAgICAgICAgbXlEaWN0ID0gUHJveGllcy5jcmVhdGUobXlEaWN0LCAodHJhY2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIG11dGF0aW9ucy5wdXNoKHRyYWNlRXZlbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlbGV0ZSBteURpY3QuZm9vO1xuXG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwicGF0aFwiOiBcIi9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblR5cGVcIjogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjYXRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIk1BTU1BTFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkb2dcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIk1BTU1BTFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogXCJmb29cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtdXRhdGlvblN0YXRlXCI6IFwiQUJTRU5UXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBhc3NlcnRKU09OKG11dGF0aW9ucywgZXhwZWN0ZWQsIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJ0ZXN0IHN5bWJvbHMgdXNlZCB0d2ljZS4uLlwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgVFlQRSA9IE9iamVjdC5mcmVlemUoe1xuICAgICAgICAgICAgICAgIE1BTU1BTDogbmV3IFN5bWJvbChcIk1BTU1BTFwiKSxcbiAgICAgICAgICAgICAgICBNQVJTVVBJQUw6IG5ldyBTeW1ib2woXCJNQVJTVVBJQUxcIilcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgbXlEaWN0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgY2F0OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFRZUEUuTUFNTUFMXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkb2c6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogVFlQRS5NQU1NQUxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICBQcm94aWVzLmNyZWF0ZShteURpY3QpO1xuXG4gICAgICAgICAgICBteURpY3QgPSB7XG4gICAgICAgICAgICAgICAgY2F0OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFRZUEUuTUFNTUFMXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkb2c6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogVFlQRS5NQU1NQUxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUHJveGllcy5jcmVhdGUobXlEaWN0KTtcblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KTtcblxuY2xhc3MgTXlUcmFjZUxpc3RlbmVyIGltcGxlbWVudHMgVHJhY2VMaXN0ZW5lciB7XG5cbiAgICBwdWJsaWMgbXV0YXRpb25zOiBUcmFjZUV2ZW50W10gPSBbXTtcblxuICAgIHB1YmxpYyBvbk11dGF0aW9uKHRyYWNlRXZlbnQ6IFRyYWNlRXZlbnQpIHtcbiAgICAgICAgLy8gaW4gcHJhY3RpY2Ugd2Ugd291bGQgd3JpdGUgdGhpcyB0byBhIGpvdXJuYWxlZCBsb2cgZmlsZS5cbiAgICAgICAgdGhpcy5tdXRhdGlvbnMucHVzaChPYmplY3RzLmR1cGxpY2F0ZSh0cmFjZUV2ZW50KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxufVxuIl19