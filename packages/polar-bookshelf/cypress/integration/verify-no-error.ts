describe('Verify we do not have any errors', () => {

    beforeEach(async () => {

        // run the following "it" tests with the specified width/height viewport
        cy.viewport(Cypress.env('WIDTH'), Cypress.env('HEIGHT'));

        cy.clearLocalStorage()
        cy.clearCookies();
        await cy.clearIndexedDB();

    });

    it('Verify there are no errors with the site', () => {

        cy.visit('http://localhost:8050');

        // wait until we get the login text field...

        cy.get('input[type=email]').type('alice@example.com');

        cy.get('.ConsoleError').should('not.exist');

    });

});
