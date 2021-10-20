import {ModelNames} from "./ModelNames";

describe('ModelNames', function() {

    it("basic", async function() {

        ModelNames.verifyRequired(['Cloze', 'Basic']);
        ModelNames.verifyRequired(['Cloze', 'Basic', 'foo', 'bar']);

        // assert.throws(() => ModelNames.verifyRequired(['foo', 'bar']));
        // assert.throws(() => ModelNames.verifyRequired(['foo', 'bar', 'Cloze']));
        // assert.throws(() => ModelNames.verifyRequired(['foo', 'bar', 'Basic']));

    });

});
