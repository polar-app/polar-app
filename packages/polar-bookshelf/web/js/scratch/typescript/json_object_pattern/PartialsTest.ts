import {assert} from 'chai';

class Address {

    public city: string;
    public state: string;
    public zip: number;

    // constructor(city: string, state: string, zip: number) {
    //     this.city = city;
    //     this.state = state;
    //     this.zip = zip;
    // }
    //

    public constructor(address: Address) {
        this.city = address.city;
        this.state = address.state;
        this.zip = address.zip;

    }

    static create(address: Partial<Address>): Address {
        let result = Object.create(Address.prototype);
        Object.assign(result, address);
        return result;
    }

}

// https://github.com/Microsoft/TypeScript/issues/5326
// this is a descructured constructor.. not sure if it's good though.


describe('Partials', function() {

    xit("Test basic partial", function () {

        Address.create({});

        //
        //
        // strings.map(current => 101);

    });

    xit("Test defaults with partials", function () {

        let address = Address.create({});

        assert.equal(address.city, "San Francisco");

        //
        //
        // strings.map(current => 101);

    });

    xit("Readonly types.", function () {

        let address = Address.create({});

        assert.equal(address.city, "San Francisco");

        //
        //
        // strings.map(current => 101);

    });

});

