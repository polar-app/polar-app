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
        cy.get("input[placeholder='Enter your Code Here']").type('123 456')

        cy.get('button[type=button]')
            .contains("VERIFY CODE", {matchCase: false, timeout: 15000})
            .click();

        // this will wait for the app to login now
        cy.get('#add-content-dropdown', {timeout: 15000});
    }

    it('Can list my notes', () => {
        cy.visit('http://localhost:8050');

        login();

        // Click on "Notes" in the sidebar
        cy.get('#sidenav div[title=Notes]').click();

        // Notes listing should have at least one note
        cy.get('.MuiDataGrid-renderingZone', {timeout: 10000}).children().its('length').should('be.gte', 1)
    })

    it('Can find note by name', () => {
        cy.visit('http://localhost:8050');

        login();

        // Click on "Notes" in the sidebar
        cy.get('#sidenav div[title=Notes]', {timeout: 10000}).click();

        cy.get('.SearchForNote input[type=text]')
            .first()
            .click()
            .type('Alice');
    })
});
