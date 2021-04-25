import {assert} from 'chai';
import {LinksValidator} from "./LinksValidator";

describe('LinksValidator', async function() {

    it("basic", async function() {

        assert.deepEqual(LinksValidator.filter(['file://etc/hosts', 'http://cnn.com', 'https://www.cnn.com', 'mailto:foo@example.com'] ),
                        ['http://cnn.com', 'https://www.cnn.com']);

        assert.isUndefined(LinksValidator.filter(undefined));

    });

});
