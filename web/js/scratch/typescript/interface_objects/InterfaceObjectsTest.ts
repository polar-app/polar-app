import {assertJSON} from '../../../test/Assertions';

describe('Custom objects from JSON', function() {

    it("No custom constructor", function () {

        class Address {

            public readonly city: string;
            public readonly state: string;
            public readonly zip: string;

        }

        let address: Address = Object.assign(new Address(),  {
            city: "San Francisco",
            state: "California",
            zip: 94107
        });

        let expected = {
            "city": "San Francisco",
            "state": "California",
            "zip": 94107
        };

        assertJSON(address, expected);

    });

});
