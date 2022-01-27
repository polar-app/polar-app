import {E2E} from "../lib/E2E";

describe('Notes', function () {

    beforeEach(() => {

        E2E.Sessions.reset();

    });

    it('Can open a single note', () => {

        cy.visit(E2E.Sessions.appURL());

        E2E.Auth.doLogin('testing@getpolarized.io', '123 456');

        E2E.ConsoleErrors.verifyNoErrors();

        E2E.Nav.goToNotes();

        openSingleNote();

        E2E.ConsoleErrors.verifyNoErrors();

    })

    function openSingleNote() {

        // FIXME: don't use then() here ideally because this is going to get annoying but the way
        // cypress evaluates code might cause us issues.

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
