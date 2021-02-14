/// <reference types="cypress" />

context('Notes', () => {

    // https://on.cypress.io/interacting-with-elements

    it('Load the initial page', () => {

        cy.visit('http://localhost:8050/apps/stories/notes/World%20War%20II');

        cy.get(".Note")
            .contains("World War II")
            .type("hello")
            .contains("hello")
            .type("\n");

    });


    it('Create new node', () => {

        cy.visit('http://localhost:8050/apps/stories/notes/World%20War%20II');

        cy.get(".Note")
            .contains("World War II")
            .type("hello")
            .type("\n");

    });

})
