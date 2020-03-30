import * as _ from 'lodash';
import {assertJSON} from '../../../test/Assertions';

describe('Test', function() {


    interface Address {

        readonly city: string;


    }

    interface Customer {
        readonly addresses: Address[]
    }

    let customers: Customer[] = [
        {
            addresses: [
                {
                    city: "San Francisco"
                },
                {
                    city: "Sacramento",
                }

            ]
        },
        {
            addresses: [
                {
                    city: "Baltimore"
                },
                {
                    city: "Oakland",
                }

            ]
        }
    ];

    it("unchained", function () {

        let result = _.map(_.flatten(_.map(customers, customer => customer.addresses)), address => address.city);

        let expected = [
            "San Francisco",
            "Sacramento",
            "Baltimore",
            "Oakland"
        ];
        assertJSON(result, expected);

    });

    it("chained", function () {

        let result =_.chain(customers)
            .map(customer => customer.addresses)
            .flatten()
            .map(address => address.city)
            .value()

        let expected = [
            "San Francisco",
            "Sacramento",
            "Baltimore",
            "Oakland"
        ];

        assertJSON(result, expected);

    });


});

