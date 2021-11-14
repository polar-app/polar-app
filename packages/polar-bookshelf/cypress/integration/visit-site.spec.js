describe('Visiting Site on Device', () => {

    beforeEach(() => {
        // run the following "it" tests with the specified width/height viewport
        cy.viewport(Cypress.env('WIDTH'), Cypress.env('HEIGHT'));
    });

    afterEach(() => {
        // cy.window().then((win) => {
        //     expect(win.console.error).to.have.callCount(0);
        //     expect(win.console.warn).to.have.callCount(0);
        // });
    });

    it('Visits Site', () => {

        // https://stackoverflow.com/questions/53898085/check-if-an-error-has-been-written-to-the-console

        // https://docs.cypress.io/guides/getting-started/testing-your-app#Logging-in
        // https://docs.cypress.io/guides/references/assertions#Sinon-Chai

        cy.visit('http://localhost:8050', {
            onBeforeLoad(win) {
                console.log("FIXME here")

                cy.stub(win.console, 'log').as('consoleLog')

                // console.log("FIXME: GOT IT")
                // cy.stub(win.console, 'log').as('consoleLog')
                // cy.stub(win.console, 'error').as('consoleError')
            }
        });

        // assert.isTrue(onBeforeLoad, "onBeforeLoad not called");

        cy.get('input[type=text]').type('alice@example.com')
        //
        // cy.get('@consoleLog').to.have.callCount(0);
        //
        // cy.get('@consoleLog').should('be.empty')

        // the following gives the error:
        //  The chainer `callCount(0);` was not found. Could not build assertion.
        // cy.get('@consoleLog').should('to.have.callCount(0);')

        // TODO: this is what the documentation says should work but it doesn't work at all.
        // we get:
        // https://docs.cypress.io/guides/references/assertions#Sinon-Chai

        cy.get('@consoleLog');

        // expect(cy.get('@consoleLog')).debug()

        // expect(cy.get('@consoleLog')).to.have.callCount(0);
        // cy.get('@consoleLog').should('be.calledWith', 'Hello World!')

        // cy.get('@consoleError').to.have.callCount(0);

        // cy.window().then((win) => {
        //     // expect(win.console.error).to.have.callCount(0);
        //     // expect(win.console.warn).to.have.callCount(0);
        //
        //
        // });

    });

});
