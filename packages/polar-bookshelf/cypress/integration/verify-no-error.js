describe('Verify we do not have any errors', () => {

    beforeEach(() => {
        // run the following "it" tests with the specified width/height viewport
        cy.viewport(Cypress.env('WIDTH'), Cypress.env('HEIGHT'));
    });

    it('Verify there are no errors with the site', () => {

        cy.visit('http://localhost:8050');

        // wait until we get the login text field...

        cy.get('input[type=text]').type('alice@example.com')

        cy.get('.ConsoleError').should('not.exist');

    });

});
