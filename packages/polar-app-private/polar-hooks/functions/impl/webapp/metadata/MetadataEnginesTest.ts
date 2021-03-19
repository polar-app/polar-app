import {assert} from 'chai';
import {MetadataEngines} from "./MetadataEngines";

describe('MetadataEngines', function() {

    it("basic", function() {

        const ref = MetadataEngines.compute('/group/linux')
        assert.ok(ref);
        assert.equal(ref.source, '/group/:group');

    });

    it("basic1", function() {

        const ref = MetadataEngines.compute('/group/Google/highlight/1cyXotN7YvjMyRiXfCMU38oFxqbk2krdhzHt8fBYYK66MCFVww');
        assert.ok(ref);
        assert.equal(ref.source, '/group/:group/highlight/:id');

    });

});
