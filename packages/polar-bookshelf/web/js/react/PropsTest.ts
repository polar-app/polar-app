import {assertJSON} from "polar-test/src/test/Assertions";
import {Props} from "./Props";

describe('Props', function() {

    it('basic', function() {

        assertJSON(Props.merge({style: {color: 'red'}}, {style: {backgroundColor: 'red'}}), {
            "style": {
                "backgroundColor": "red",
                "color": "red"
            }
        });

    });

});
