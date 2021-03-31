/// <reference types="cypress" />

context('Notes', () => {

    // https://on.cypress.io/interacting-with-elements

    it('Load the initial page', () => {

        cy.visit('http://localhost:8050/apps/stories/notes/World%20War%20II');

        cy.get(".Note")
            .contains("World War II")

    });


    it('Create new node', () => {

        cy.visit('http://localhost:8050/apps/stories/notes/World%20War%20II');

        cy.get(".Note")
            .contains("World War II")
            .type("hello")
            .contains("hello")
            .type("\n");

    });

    it('split node', () => {

        cy.visit('http://localhost:8050/apps/stories/notes/World%20War%20II');

        cy.get(".Note")
            .contains("Axis Powers")
            .type('{home}');

        cy.get(".Note")
            .contains("Axis Powers")
            .type('{rightarrow}')
            .type('{rightarrow}')
            .type('{rightarrow}')
            .type('{rightarrow}')
            .type('\n')

        // the 3rd note should equal 'Axix' and the 4th should be split...
        cy.get(".Note")
            // .should('match', /Powers: Germany, Italy, Japan/i)

//.type('{rightarrow}{rightarrow}{rightarrow}{rightarrow}');

        //
        // cy.get(".Note")
        //     .contains("Axis Powers")
        //     //.type('{rightarrow}{rightarrow}{rightarrow}{rightarrow}');
        //     .type('{rightarrow}')
        //     .type("\n");


    });

})
