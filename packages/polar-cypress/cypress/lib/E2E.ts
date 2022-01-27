export namespace E2E {

    export namespace Sessions {

        export function reset() {

            // run the following "it" tests with the specified width/height viewport
            cy.viewport(Cypress.env('WIDTH'), Cypress.env('HEIGHT'));

            cy.clearLocalStorage()
            cy.clearCookies();
            cy.clearIndexedDB();

        }

    }


}
