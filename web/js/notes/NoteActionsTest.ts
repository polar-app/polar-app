import {NoteActions} from "./NoteActions";
import {assert} from 'chai';

describe('NoteActions', function() {

    it("basic", async function() {

        assert.equal(NoteActions.computePromptFromText(' from 1939 to 1945 /a', 20, 21), 'a');

    });

});
