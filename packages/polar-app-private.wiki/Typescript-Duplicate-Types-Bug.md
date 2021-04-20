Typescript has a 'bug' which manifests itself with Lerna when trying to depend
on another project that has @types there as well.

We will get a DuplicateIdentifier error in the compiler

The issue is that there will be two packages with the same version

node_modules/@types/foo
node_modules/linked-project/node_modules/@types/foo

The workaround is to add the following to tsconfig.json:

```text
    "paths": {
      "*": [
        "node_modules/@types/*", "*",
        "node_modules/@polar-app-types/*", "*"
      ]
    },

```
