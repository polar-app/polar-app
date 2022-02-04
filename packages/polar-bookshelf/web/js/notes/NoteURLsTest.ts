import {NoteURLs} from "./NoteURLs";
import {assert} from 'chai';

describe('NoteURLs', () => {

    it('basic parse', () => {

        assert.deepEqual(NoteURLs.parse('http://localhost:8050/notes/Deceived%20by%20Design'), {target: "Deceived by Design"});
        assert.deepEqual(NoteURLs.parse('/notes/Deceived%20by%20Design'), {target: "Deceived by Design"});

    });

});
