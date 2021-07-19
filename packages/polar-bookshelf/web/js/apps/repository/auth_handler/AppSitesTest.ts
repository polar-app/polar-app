import {assert} from 'chai';
import {AppSites} from "./AppSites";

describe('AppSites', function() {

    it("isApp", async function() {
        assert.isTrue(AppSites.isApp('http://localhost:8050'));
        assert.isTrue(AppSites.isApp('http://127.0.0.1:8050'));
        assert.isFalse(AppSites.isApp('http://example.com'))
    });

});
