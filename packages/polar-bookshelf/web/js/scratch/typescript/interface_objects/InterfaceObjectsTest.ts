import {assertJSON} from '../../../test/Assertions';
import {assert} from 'chai';

describe('Custom objects from JSON', function() {

    it("No custom constructor", function () {

        class Address {

            public readonly city?: string;
            public readonly state?: string;
            public readonly zip?: string;

        }

        let address: Address = Object.assign(new Address(),  {
            city: "San Francisco",
            state: "California",
            zip: 94107
        });

        assert.equal(address.constructor.name, "Address");

        let expected = {
            "city": "San Francisco",
            "state": "California",
            "zip": 94107
        };

        assertJSON(address, expected);

    });

    it("Test of single interface object from JSON", function() {

        interface Address {
            readonly city: string;
            readonly state: string;
            readonly zip: number;
        }

        let address: Address = {
            city: "San Francisco",
            state: "California",
            zip: 94107
        };

        let expected = {
            "city": "San Francisco",
            "state": "California",
            "zip": 94107
        };

        assertJSON(address, expected);

    })

    it("Test of single interface object from JSON", function() {

        interface Address {
            readonly city: string;
            readonly state: string;
            readonly zip: number;
        }

        let address: Address[] = [{
            city: "San Francisco",
            state: "California",
            zip: 94107
        }];

        let expected = [{
            "city": "San Francisco",
            "state": "California",
            "zip": 94107
        }];

        assertJSON(address, expected);

    })

    it("type promotion and methods", function() {

        class Address {

            readonly city: string;
            readonly state: string;
            readonly zip: number;

            constructor(city: string, state: string, zip: number) {
                this.city = city;
                this.state = state;
                this.zip = zip;
            }

            format() {
                return `${this.city}, ${this.state} ${this.zip}`;
            }

        }


        let address: Address;


        address = new Address("San Francisco", "CA", 94107);

        assert.equal(address.constructor.name, "Address");

        assert.notEqual(address.format, null);

        address = <Address> {
            // city: "San Francisco",
            // state: "CA",
            // zip: 94107
        };

        console.log(address.city);

        // It IS null so this is a flaw of the language unfortunately.
        //assert.notEqual(address.format, null);

    });


});
