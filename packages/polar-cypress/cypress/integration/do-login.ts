import {E2E} from "../lib/E2E";

describe('Verify that we can login', () => {

    beforeEach(() => {
        E2E.Sessions.reset();
    });

    it('Login and verify that we have no errors.', () => {

        cy.visit(E2E.Sessions.appURL());

        E2E.ConsoleErrors.verifyNoErrors();

        E2E.Auth.doLogin('testing@getpolarized.io', '123 456');

        // this will wait for the app to login now
        cy.get('#add-content-dropdown', {timeout: 15000});

        E2E.ConsoleErrors.verifyNoErrors();

    });

});
