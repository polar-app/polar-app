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

    export namespace Auth {

        export function doLogin(email: string, code: string) {

            cy.get('input[type=email]').type(email)
            cy.get('button[type=button]')
                .contains("SIGN IN WITH EMAIL", {matchCase: false})
                .click();
            cy.get("input[placeholder='Enter your Code Here']", {timeout: 10000}).type(code)

            cy.get('button[type=button]')
                .contains("VERIFY CODE", {matchCase: false, timeout: 15000})
                .click();

            // this will wait for the app to login now
            cy.get('#add-content-dropdown', {timeout: 15000});

        }

    }

    export namespace Nav {

        export function goToNotes() {
            // Click on "Notes" in the sidebar
            cy.get('#sidenav div[title=Notes]').click();

            // Wait for notes listing data table to have at least one note
            cy.get('.NotesRepoTable2 .MuiTableBody-root')
                .children({})
                .its('length')
                .should('be.gte', 1);
        }

    }

}
