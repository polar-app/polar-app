describe('Verify that we can login', () => {

    beforeEach(() => {


        // run the following "it" tests with the specified width/height viewport
        cy.viewport(Cypress.env('WIDTH'), Cypress.env('HEIGHT'));

        cy.clearLocalStorage()
        cy.clearCookies();
        cy.clearIndexedDB();
        // cy.session().clear()

    });

    it('Login and verify that we have no errors.', () => {

        cy.visit('http://localhost:8050');

        function verifyNoErrors() {

            // wait until we get the login text field...

            cy.get('.ConsoleError').should('not.exist');

        }

        verifyNoErrors();

        cy.get('input[type=text]').type('getpolarized.test+test@gmail.com')
        cy.get('button[type=button]')
            .contains("SIGN IN WITH EMAIL", { matchCase: false })
            .click();
        cy.get("input[placeholder='Enter your Code Here']").type('123 456')

        cy.get('button[type=button]')
            .contains("VERIFY CODE", { matchCase: false })
            .click();

        // this will wait for the app to login now
        // cy.get('button[type=button]')
        //     .contains("ADD DOCUMENT", { matchCase: false })

    });

});
