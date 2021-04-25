# Problems

## Compile time assertions.

## No default values for interfaces or custom instantiated classes

This is a problem because we can't rely on them working.

### Solutions

- Create a Default object and copy the fields over manually in the setup() 
  method.

## No constructor override


# Ideas

## Use IFoo and FOO

This way I can create literals like:

let iFoo: IFoo {}

and then construct Foo from IFoo... 

If I can Object.assign it from default that would work.
