# Overview

Notes for MobX issues we found in *our* environment.

# Bugs, issues

- In order for a variable to be observable, it must be set in either the
  constructor or the class definition.  When a value is not assigned, mobx can't
  see it and it doesn't become observable.
  
    - Make sure all tests for the store use isObservableProp to always assert
      that a property is observable
      
    - 
    
- observer components aren't being called:

    - it might be that the store is using the wrong object. Make sure you're
      listening to the right object by generating a random 'id' for each store
      object and verifying you have the right one.
      
    - 