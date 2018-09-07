import {Dictionaries} from './Dictionaries';
import {assertJSON} from '../test/Assertions';

import * as _ from "lodash";

describe('Dictionaries', function() {

    it("basic", async function () {

        let dict = {
            'z': 1,
            'a': 2
        };

        let expected = {
            "a": 2,
            "z": 1
        };

        assertJSON(Dictionaries.sorted(dict), expected);

    });

    it("with nulls and undefined", async function () {

        let dict = {
            'z': null,
            'a': undefined
        };

        let expected = {
            "z": null
        };

        assertJSON(Dictionaries.sorted(dict), expected);

    });

    it("nested", async function () {

        let dict = {
            z: 1,
            a: 2,
            nested: {
                'z': 1,
                'a': 2
            }
        };

        let expected = {
            "a": 2,
            "nested": {
                "a": 2,
                "z": 1
            },
            "z": 1
        };

        assertJSON(Dictionaries.sorted(dict), expected);

    });

    // it("toDict", function() {
    //
    //     interface Name {
    //         first: string;
    //         last: string;
    //     }
    //
    //     const names: Name[] = [
    //         { first: 'alice', last: 'smith' },
    //         { first: 'bob', last: 'smith' },
    //     ];
    //
    //     _.chain(names)
    //         .reduce((accumulator: any, value: any, initial: any) => {
    //         console.log("here");
    //     }).value();
    //
    // });

});

