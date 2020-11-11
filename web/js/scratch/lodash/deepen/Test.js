"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const Assertions_1 = require("../../../test/Assertions");
describe('Test', function () {
    let customers = [
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
        Assertions_1.assertJSON(result, expected);
    });
    it("chained", function () {
        let result = _.chain(customers)
            .map(customer => customer.addresses)
            .flatten()
            .map(address => address.city)
            .value();
        let expected = [
            "San Francisco",
            "Sacramento",
            "Baltimore",
            "Oakland"
        ];
        Assertions_1.assertJSON(result, expected);
    });
});
//# sourceMappingURL=Test.js.map