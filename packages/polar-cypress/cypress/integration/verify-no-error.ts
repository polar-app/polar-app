import {E2E} from "../lib/E2E";

describe('Verify we do not have any errors', () => {

    beforeEach(() => {

        E2E.Sessions.reset();

    });

    it('Verify there are no errors with the site', () => {

        cy.visit('http://localhost:8050');

        // wait until we get the login text field...

        cy.get('input[type=email]').type('alice@example.com');

        cy.get('.ConsoleError').should('not.exist');

    });

});
