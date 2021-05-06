// testing using interfaces with required fields for creating objects.  It WORKS
// but default values on interfaces does not work. This is one feature I need
// I think.  Otherwise we could ue a partial<IAddress> but that makes the
// constructor much harder to implement and is kind of pointless for compiler
// requirements.

import {ITAddress} from './ITAddress';

class Address implements IAddress {

    public city: string;
    public state: string;
    public zip: number;

    constructor(city: string, state: string, zip: number) {
        this.city = city;
        this.state = state;
        this.zip = zip;
    }

    // static create(address: Partial<Address>): Address {
    //     let result = Object.create(Address.prototype);
    //     Object.assign(result, address);
    //     return result;
    // }

    static create(archetype: IAddress): Address {
        return new Address(archetype.city, archetype.state, archetype.zip);
    }

}

interface IAddress {

    city: string;
    state: string;
    zip: number;

}

function fromAddress(obj: Address) {
    return obj;
}

function toIAddress(obj: IAddress): IAddress {
    return obj;
}

let address0 = <Address> {

};

let address1 = <IAddress> {

};

let address2 = <ITAddress> {

};

//fromAddress({});

//fromIAddress({})

// TODO: Electron.Rectangle with a T.ds file is a much better setup.

describe('Test', function() {

    it("Basic test", function () {

        let address = Address.create({
            city: 'San Francisco',
            state: 'CA',
            zip: 94546
        });

        console.log("FIXME: " + typeof address)
        console.log("FIXME: " + (address instanceof Address));

    });

});

