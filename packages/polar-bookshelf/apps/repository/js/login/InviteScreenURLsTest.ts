import {InviteScreenURLs} from "./InviteScreenURLs";
import {Assertions} from "polar-test/src/test/Assertions";
import {assert} from 'chai';
import assertJSON = Assertions.assertJSON;

describe("InviteScreenURLs", () => {
    it("basic", () => {

        assertJSON(InviteScreenURLs.parse('/invite/12345'), {
            "user_referral_code": "12345"
        });

        assertJSON(InviteScreenURLs.parse('https://app.getpolarized.io/invite/12345'), {
            "user_referral_code": "12345"
        });

        assertJSON(InviteScreenURLs.parse('http://localhost:8050/invite/12345'), {
            "user_referral_code": "12345"
        });

        assert.isUndefined(InviteScreenURLs.parse('http://localhost:8050/invite/'));
        assert.isUndefined(InviteScreenURLs.parse('http://localhost:8050/invite'));

    });
})
