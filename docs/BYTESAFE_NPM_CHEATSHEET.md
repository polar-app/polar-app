# Overview

Every once in a while we need to make some patches to 3rd party libraries to work with Polar.

We usually can't upload these to the main NPM repo because we don't have permissions to overwrite the 
official NPM packages (obviously).

What we do is that we use a 3rd party registry called 'bytesafe' to upload these custom packages 
and we can now have our own namespace for these separate from the main registry.

# Update .npmrc

Update the contents of your ~/.npmrc to:

```
//polar-app.bytesafe.dev/r/default:_authToken=01EQ780ERRQB9JFY9BV5HHX823
//polar-app.bytesafe.dev/r/default/:_authToken=01EQ780ERRQB9JFY9BV5HHX823
registry=https://polar-app.bytesafe.dev/r/default/
```

This will give you rw access to our bytesafe registry.

# Version

Change the version of the package by adding a '-polar.1' suffix.

For example:

```
  "version": "0.3.89-polar.1",
```

For every major change that we publish just increment that last integer after the '.'

# publish

To upload the new package just run:

```
npm publish

```

# Update dependencies

Now add this library as a dependency of the project you want to work with.

Then run:

```
lerna bootstrap
```

At the polar-app root and the new library will be pulled down.

# Typescript.

Some modules MAY NOT have typescript dependencies.  

We can add our own in the root by adding a file called

index.d.ts 

And then we should see the typescript types with the new package.

You MAY need to set:

```
"types": "./index.d.ts"
```

if it doesn't automatically pick them up.

You can also use require() but that means you won't have any types to work with.