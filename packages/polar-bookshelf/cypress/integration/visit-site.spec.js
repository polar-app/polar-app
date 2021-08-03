describe('Visting Site on Device', () => {
  beforeEach(() => {
    // run the following "it" tests with the specified width/height viewport
    cy.viewport(Cypress.env('WIDTH'), Cypress.env('HEIGHT'));
  });

  it('Visits Site', () => {
    cy.visit('http://localhost:8050');
  });
});
