import "reflect-metadata";

describe('TestDecorators', function() {

    it("basic decorators", function () {

        function Path(value: string) {
            return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

                console.log("FIXME propertyKey", propertyKey)

                let paramtypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);

                console.log("FIXME1:", Reflect.getMetadata("design:type", target, propertyKey));

                console.log("Within my annotation: ", paramtypes);
                // FIXME: where do I store this value...

                //descriptor.enumerable = value;
                target.path = value;

                // FIXME: how do I get method params. wit those I can do full
                // API handling

                console.log("FIXME: target", target);
                console.log("FIXME: descriptor", descriptor);

            };
        }

        class Address {

            public readonly city: string;
            public readonly state: string;
            public readonly zip: number;

            constructor(city: string, state: string, zip: number) {
                this.city = city;
                this.state = state;
                this.zip = zip;
            }

        }

        interface Handler<T> {
            handle(value: T): void;
        }

        class AddressHandler implements Handler<Address> {

            //  A method decorator cannot be used in a declaration file, on an
            // overload, or in any other ambient context (such as in a declare class).
            @Path("/api/address")
            handle(address: Address): void {

            }

        }



    });

});

