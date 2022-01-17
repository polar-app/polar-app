describe('Notes', function () {

    beforeEach(() => {
        cy.viewport(Cypress.env('WIDTH'), Cypress.env('HEIGHT'));
        cy.clearLocalStorage()
        cy.clearCookies();
        cy.clearIndexedDB();
    });

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

    it('Can open a single note', () => {
        cy.visit('http://localhost:8050');

        login();

        // Click on "Notes" in the sidebar
        cy.get('#sidenav div[title=Notes]').click();

        // Notes listing should have at least one note
        cy.get('.notes-listing .MuiTableBody-root')
            .children()
            .its('length')
            .should('be.gte', 1)

        // Try to open a single note
        cy.get('.notes-listing .MuiTableBody-root td.MuiTableCell-body')
            .contains("Alice's Adventures in Wonderland")
            .dblclick();
    })
});
