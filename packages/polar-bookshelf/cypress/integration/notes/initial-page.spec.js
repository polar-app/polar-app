/// <reference types="cypress" />

context('Notes', () => {

    // https://on.cypress.io/interacting-with-elements

    it('.type() - type into a DOM element', () => {

        cy.visit('http://localhost:8050/apps/stories/notes/World%20War%20II');

        cy.get(".Note").contains("World War II");


    });

})
