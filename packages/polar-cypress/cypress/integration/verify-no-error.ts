import {E2E} from "../lib/E2E";

describe('Verify we do not have any errors', () => {

    beforeEach(() => {

        E2E.Sessions.reset();

    });

    it('Verify there are no errors with the site', () => {

        cy.visit(E2E.Sessions.appURL());

        cy.get('input[type=email]').type('alice@example.com');

        E2E.ConsoleErrors.verifyNoErrors();

    });

});
