import {assertJSON} from "polar-test/src/test/Assertions";
import {FirestoreArray, FirestoreDict} from "./Collections";

describe('Collections', function() {

    it('array types', () => {

        const arr0: FirestoreArray = [
            'asdf'
        ];

        assertJSON(arr0, ['asdf']);

        const arr1: FirestoreArray = [ 'asdf' ];

        assertJSON(arr1, ['asdf']);

        type MyArray<T> = ReadonlyArray<T>

        interface MyDict {
            readonly [key: number]: string;
        }

        const bar0: readonly string[] = ['foo'];
        const bar1: MyArray<string> = ['foo'];

        bar0.includes('foo');
        bar1.includes('foo');

    });


    it("basic", function() {
        const dict: FirestoreDict = {
            foo: 'bar',
            cat: {
                dog: '123',
                bird: 1,
                kitten: false,
                puppy: [
                    {
                        dog: {
                            kitty: 'cat'
                        }
                    }
                ]

            }
        };

        interface Cat {
            readonly name: string;
            readonly legs: number;
        }

        const cat: Cat = {
            name: 'monster',
            legs: 4
        };

        const cat0: FirestoreDict = {
            name: 'monster',
            legs: 4
        };

        // const myCat: Cat = cat0;
        // const MyCat0: FirestoreDict = cat;

        interface MyFoo {
            readonly name: string;
        }

        type T1 = keyof MyFoo;

        // interface MyInterface {
        //     [foo: T1]: MyFoo
        // }
        //

        type Partial<T> = { readonly
            [P in keyof T]: string;
        };

        // interface StringDict {
        //     [key: string]: number | string | boolean;
        // }
        //
        // interface MyDict<T extends StringDict> {
        //     [key: keyof T]: any;
        // }

    });

});
