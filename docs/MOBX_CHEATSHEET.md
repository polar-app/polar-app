# Bugs, issues

- In order for a variable to be observable, it must be set in either the
  constructor or the class definition.  When a value is not assigned, mobx can't
  see it and it doesn't become observable.
  
    - Make sure all tests for the store use isObservableProp to always assert
      that a property is observable
      
    - 