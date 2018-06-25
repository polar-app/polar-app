var assert = require('assert');

const {Objects} = require("../utils");
const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");
const {Symbol} = require("../metadata/Symbol");

class MyMutationListener {

    constructor() {
        this.mutations = [];
    }

    onMutation(mutationType, target, property, value) {
        // in practice we would write this to a journaled log file.
        this.mutations.push(Objects.duplicate({mutationType, target, property, value}));
        return true;
    }

}

describe('Proxies', function() {

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

            myDict = Proxies.create(myDict).deepTrace(function (traceEvent) {
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


            Proxies.create(myDict).deepTrace();

            myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };

            Proxies.create(myDict).deepTrace();

        });

    });

});
