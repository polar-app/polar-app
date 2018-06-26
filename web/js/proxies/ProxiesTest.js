var assert = require('assert');

const {Objects} = require("../utils");
const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");
const {Symbol} = require("../metadata/Symbol");


describe('Proxies', function() {


    describe('paths', function() {

        it("work with paths directly", function () {

            // make sure the path is right...

            let myDict = {
                cars: {
                    "mazda6": {
                        borrowed: false
                    }
                }
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.cars.mazda6.borrowed = true;

            let expected = [
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

            assertJSON(myTraceListener.mutations, expected);

        })
    });

    describe('traceListeners', function() {

        // unfortunately , there are 4 types we have to test
        //
        // the default (function or object)
        // additional (function or object).

        it("default as object", function () {

            let myDict = {
                cat: "leo"
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.cat = "monster";

            let expected = [
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

            assertJSON(myTraceListener.mutations, expected);

        })

        it("default as function", function () {

            let myDict = {
                cat: "leo"
            };

            let mutations = [];
            myDict = Proxies.create(myDict, function (traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.cat = "monster";

            let expected = [
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

            assertJSON(mutations, expected);

        })


        it("addListener as object", function () {

            let myDict = {
                cat: "leo"
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, function () {

            });

            myDict.addTraceListener(myTraceListener);

            myDict.cat = "monster";

            let expected = [
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

            assertJSON(myTraceListener.mutations, expected);

        })

        it("addListener as function", function () {

            let myDict = {
                cat: "leo"
            };

            myDict = Proxies.create(myDict, function () {

            });

            let mutations = [];

            myDict.addTraceListener(function (traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.cat = "monster";

            let expected = [
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

            assertJSON(mutations, expected);

        })


    });

    describe('deepTrace', function() {

        // if we have a shared object reference, make sure we receive two events
        // for it, one at each path.
        xit("shared object reference", function () {

            let address = {
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

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.alice.address.city = "Oakland";

            assert.equal(myDict.alice.address.city, "Oakland");
            assert.equal(myDict.bob.address.city, "Oakland");

            // FIXME: this is broken.. we change the value in two places but only
            // fire one event listener..  I'm going to have to rethink the way
            // I'm doing events for this to work.

            let expected = [

            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("deep tracing", function () {

            let myDict = {'foo': 'bar'};

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.foo = 'frog';

            let expected = [
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

            assertJSON(myTraceListener.mutations, expected);

        });

        it("deep tracing with nested path", function () {

            let myDict = {
                foo: 'bar',
                cat: {
                    name: "leo"
                }
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.cat.name = "monster";

            let expected = [
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

            assertJSON(myTraceListener.mutations, expected);

        });

        it("mutation of all fields", function () {

            let myDict = {
                foo: 'bar',
                cat: {
                    name: "leo"
                }
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.foo="cat";
            myDict.cat.name = "monster";

            let expected = [
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

            assertJSON(myTraceListener.mutations, expected);

        });

        it("as function", function () {

            let myDict = {'foo': 'bar'};

            let mutations = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.foo = 'frog';

            let expected = [
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

            assertJSON(mutations, expected);

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

            let mutations = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.pages[1].marked=false;

            let expected = [
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

            // make a pattern of /pages/[int]/foo so that we can listen to the
            // stream of objects and then handle the right one.

            assertJSON(mutations, expected);

        });



        it("add listener to object", function () {

            let myDict = {
                "cat": "dog"
            };


            myDict = Proxies.create(myDict, function(traceEvent) {
                // noop
            });

            let mutations = [];

            myDict.addTraceListener(function (traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict["asdf"] = "bar";

            // make a pattern of /pages/[int]/foo so that we can listen to the
            // stream of objects and then handle the right one.

            let expected = [
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

            assertJSON(mutations, expected);

        });


        it("fire initial values", function () {

            let myDict = {
                "cat": "dog"
            };

            let mutations = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                // noop
            });

            myDict.addTraceListener(function (traceEvent) {
                mutations.push(traceEvent);
            }).sync();

            let expected = [
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

            assertJSON(mutations, expected);

        });

        it("delete value", function () {

            let myDict = {
                "cat": "dog"
            };

            let mutations = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                mutations.push(traceEvent);
            });

            delete myDict['cat'];

            let expected = [
                {
                    "path": "/",
                    "mutationType": "DELETE",
                    "target": {},
                    "property": "cat",
                    "previousValue": "dog",
                    "mutationState": "ABSENT"
                }
            ];

            assert.equal( mutations[0].value === undefined, true);
            assert.equal( "value" in mutations[0], true);

            assertJSON(mutations, expected);

        });

        it("make sure value actually replaced", function () {

            let myDict = {
                "cat": "leo"
            };

            myDict = Proxies.create(myDict, function(traceEvent) {
                return true;
            });

            myDict['cat']="monster";

            assert.equal( myDict['cat'], "monster");

        });


        it("add object to existing traced object and expect mutation events", function () {

            let myDict = {
                "rootPrimitiveValue": "dog"
            };

            let mutations = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            assert.equal( myDict.__path, "/" );

            // this should trigger a new handler to be added
            myDict.depth0 = {

            };

            myDict.depth0.depth1 = {

            };

            myDict.depth0.depth2 = {
                deepPrimitiveValue: "cat"
            };

            // now add more data to the gorilla.

            myDict.depth0.depth2.setPrimitiveValue = "red";

            assert.equal( myDict.__traceListeners.length, 1 );
            assert.equal( myDict.depth0.__traceListeners.length, 1 );
            assert.equal( myDict.depth0.depth1.__traceListeners.length, 1 );

            assert.equal( myDict.depth0.__path, "/depth0" );
            assert.equal( myDict.depth0.depth1.__path, "/depth0/depth1" );

            assert.equal(mutations.length, 4);

            let expected = [
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

            assertJSON(mutations, expected);

        });

    });

    describe('deepTrace', function() {

        it("test with object.Freeze", function () {

            let TYPE = Object.freeze({
                MAMMAL: new Symbol("MAMMAL"),
                MARSUPIAL: new Symbol("MARSUPIAL")
            });

            let myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };

            let mutations = [];

            myDict = Proxies.create(myDict, function (traceEvent) {
                mutations.push(traceEvent);
            });

            delete myDict.foo;

            let expected = [
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

            assertJSON(mutations, expected);

        });

        it("test symbols used twice...", function () {

            let TYPE = Object.freeze({
                MAMMAL: new Symbol("MAMMAL"),
                MARSUPIAL: new Symbol("MARSUPIAL")
            });

            let myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };


            Proxies.create(myDict);

            myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };

            Proxies.create(myDict);

        });

    });

});

class MyTraceListener {

    constructor() {
        this.mutations = [];
    }

    onMutation(traceEvent) {
        // in practice we would write this to a journaled log file.
        this.mutations.push(Objects.duplicate(traceEvent));
        return true;
    }

}
