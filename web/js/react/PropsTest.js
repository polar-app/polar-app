"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../test/Assertions");
const Props_1 = require("./Props");
describe('Props', function () {
    it('basic', function () {
        Assertions_1.assertJSON(Props_1.Props.merge({ style: { color: 'red' } }, { style: { backgroundColor: 'red' } }), {
            "style": {
                "backgroundColor": "red",
                "color": "red"
            }
        });
    });
});
//# sourceMappingURL=PropsTest.js.map