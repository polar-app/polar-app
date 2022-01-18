import {expect} from "chai";

describe('Notes', function () {

    beforeEach(() => {
        cy.viewport(Cypress.env('WIDTH'), Cypress.env('HEIGHT'));
        cy.clearLocalStorage()
        cy.clearCookies();
        cy.clearIndexedDB();
    });

    it('Can open a single note', () => {
        cy.visit('http://localhost:8050');
        login();
        goToNotes();
        openSingleNote();
    })

    function login() {
        cy.get('input[type=text]').type('testing@getpolarized.io')
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
    }

    function openSingleNote() {
        // Notes listing should have at least one note
        cy.get('.notes-listing .MuiTableBody-root')
            .children({})
            .its('length')
            .should('be.gte', 1).then(() => {

            // Capture timestamp before clicking on a single note
            const timeBeforeOpeningNote = performance.now();

            // Try to open a single note
            cy.get('.notes-listing .MuiTableBody-root td.MuiTableCell-body')
                .contains("Alice's Adventures in Wonderland")
                .dblclick().then(() => {

                // Assert that the note opened successfully
                cy.contains('Reading progress').then(() => {
                    const timeAfterOpeningNote = performance.now();
                    const timeToOpenSingleNoteFromListing = timeAfterOpeningNote - timeBeforeOpeningNote;

                    // Assert that it opened quick enough... but not quicker than realistically possible
                    expect(timeToOpenSingleNoteFromListing, 'Note failed to load in between 200ms-2000ms').to.above(200).below(2000);
                })
            })
        })
    }


});
