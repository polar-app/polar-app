import {E2E} from "../lib/E2E";

describe('Notes', function () {

    beforeEach(() => {

        E2E.Sessions.reset();

    });

    it('Can open a single note', () => {

        cy.visit('http://localhost:8050');

        E2E.Auth.doLogin('testing@getpolarized.io', '123 456');

        E2E.Nav.goToNotes();

        openSingleNote();

    })

    function openSingleNote() {
        // Try to open a single note
        cy.get('.NotesRepoTable2 .MuiTableBody-root td.MuiTableCell-body')
            .then(() => {
                // Mark timestamp when note opening started
                performance.mark('note-open-started');
            })
            .contains("Alice's Adventures in Wonderland")
            .dblclick();

        // Wait for the single note to load
        cy.contains('Reading progress').then(() => {
            // Mark timestamp when note opening finished
            performance.mark('note-open-finished');
        }).then(() => {
            const timeToOpenSingleNote = performance.measure('note-open-time', 'note-open-started', 'note-open-finished').duration;
            assert.isAtLeast(timeToOpenSingleNote, 200);
            assert.isAtMost(timeToOpenSingleNote, 2000);
        });
    }

});
