import {TextType} from './TextType';
import {Texts} from './Texts';
import {assertJSON} from '../test/Assertions';

describe('Texts', function() {

    it("basic", async function () {

        let text = Texts.create("asdf", TextType.HTML);

        let expected = {
            "HTML": "asdf"
        };

        assertJSON(text, expected);

    });

});
