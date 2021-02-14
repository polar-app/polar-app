
# jumping to a URL

```javascript

cy.visit('http://localhost:8050/apps/stories/notes/World%20War%20II');

```

# Finding a element that contains some text

```typescript

cy.get('.action-email')
  .contains("Axis Powers")

````

# navigation

cy.go('back')
cy.go('forward')
cy.go(-1)
cy.go(1)

cy.location('pathname').should('include', 'navigation')
    
# entering text

    cy.get('.action-email')
      .type('fake@email.com').should('have.value', 'fake@email.com')


https://stackoverflow.com/questions/53898085/check-if-an-error-has-been-written-to-the-console
