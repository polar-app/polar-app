import {EmailAddresses} from './EmailAddresses';
import {assertJSON} from '../test/Assertions';
import ParsedMailbox = emailAddresses.ParsedMailbox;

describe('EmailAddress', function() {

    it("basic", function() {

        const text = "Kevin Burton <kevin@example.com>, \"Michaelson, Frank\" <frank@example.com>, alice@example.com";

        const parsed = EmailAddresses.parseList(text);

        assertJSON(parsed, [
            {
                "name": "Kevin Burton",
                "address": "kevin@example.com"
            },
            {
                "name": "Michaelson, Frank",
                "address": "frank@example.com"
            },
            {
                "address": "alice@example.com"
            }
        ]);

    });

});
