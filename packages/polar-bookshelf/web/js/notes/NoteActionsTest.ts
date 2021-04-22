import {NoteActions} from "./NoteActions";
import {assert} from 'chai';

describe('NoteActions', function() {

    it("basic", async function() {
        assert.equal(NoteActions.computePromptFromText(' from 1939 to 1945 /a', 20, 21), 'a');
    });

    it("at beginning of string", async function() {
        assert.equal(NoteActions.computePromptFromText('/a', 1, 2), 'a');
    });

    it("at beginning of string and with a space", async function() {
        assert.equal(NoteActions.computePromptFromText(' /a', 2, 3), 'a');
    });

    it("at beginning of string and with noise", async function() {
        assert.isUndefined(NoteActions.computePromptFromText('X/a', 2, 3));
    });

    it("basic with previous char not a space", async function() {
        assert.isUndefined(NoteActions.computePromptFromText(' from 1939 to 1945X/a', 20, 21));
    });

});
