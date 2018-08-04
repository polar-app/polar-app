describe('Partials', function() {

    it("", function () {

        class Address {

            public readonly city: string;
            public readonly state: string;
            public readonly zip: number;

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

        Address.create({});

        //
        //
        // strings.map(current => 101);

    });

});
