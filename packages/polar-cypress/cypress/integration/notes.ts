import {E2E} from "../lib/E2E";

describe('Notes', function () {

    beforeEach(() => {

        E2E.Sessions.reset();

    });

    it('Can open a single note', () => {
        cy.visit('http://localhost:8050');
        login();
        goToNotes();
        openSingleNote();
    })

    function login() {
        cy.get('input[type=email]').type('testing@getpolarized.io')
        cy.get('button[type=button]')
            .contains("SIGN IN WITH EMAIL", {matchCase: false})
            .click();
        cy.get("input[placeholder='Enter your Code Here']", {timeout: 10000}).type('123 456')

        cy.get('button[type=button]')
            .contains("VERIFY CODE", {matchCase: false, timeout: 15000})
            .click();

        // this will wait for the app to login now
        cy.get('#add-content-dropdown', {timeout: 15000});
    }

    function goToNotes() {
        // Click on "Notes" in the sidebar
        cy.get('#sidenav div[title=Notes]').click();

        // Wait for notes listing data table to have at least one note
        cy.get('.NotesRepoTable2 .MuiTableBody-root')
            .children({})
            .its('length')
            .should('be.gte', 1);
    }

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
