import assert from 'assert';

class Address {

    public readonly city: string = "San Francisco";
    public readonly state: string = "CA";
    public readonly zip: number = 94107;

    constructor(city: string, state: string, zip: number) {
        this.city = city;
        this.state = state;
        this.zip = zip;
    }

    static create(address: Partial<Address>): Address {
        let result = Object.create(Address.prototype);
        Object.assign(result, address);
        return result;
    }

}

describe('Partials', function() {

    it("Test basic partial", function () {

        Address.create({});

        //
        //
        // strings.map(current => 101);

    });

    it("Test defaults with partials", function () {

        let address = Address.create({});

        assert.equal(address.city, "San Francisco");

        //
        //
        // strings.map(current => 101);

    });


});

