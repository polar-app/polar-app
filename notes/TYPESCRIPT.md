https://www.typescriptlang.org/docs/handbook/react-&-webpack.html

- how do we get TS to work with mocha and spectron?

    - we're going to have to TS compile
        - spec.js
        - index.js

- I think that we should just do -bundle.js for our webpacked files and not do
  /dist as it's going to get too confusing.

- mocha-webpack won't work as it only supports one config.


- this works:

 find web/js/ -name "*Test.js" -exec ./node_modules/.bin/mocha-webpack --recursive --webpack-config=webpack.config-test.js "{}" ";"

 ./node_modules/.bin/mocha-webpack --recursive --webpack-config=webpack.config-test.js web/js/metadata/DocMetasTest.js

 that works too..

 ... but this doesn't work:


./node_modules/.bin/mocha-webpack --recursive --webpack-config=webpack.config-test.js "web/js/**/*Test.js"


# Strategies

## Webpack


### Pros

- already have it working

### Cons

- requires a -bundle file for every app and configuration

- takes a lot of CPU power to build every configuration

-

## electron-compile

### Pros

- seems the easiest solution

### Cons

- doesn't work with our current electron setup.

- What do we do about mocha?  I don't think it's going to just work but maybe
  I can use ts-node with it.

- complicated system that I would have to debug. More complicated than the
  regular typescript compiler.

- might be easier to just use the typescript compiler and compile my whole app
  this way.

### TODO

- renderer doesn't work.  it says it can't find imports.



## babel-register

### Pros

### Cons

Won't work with our webpack config and I might have to reconfigure some stuff.

## ts-node

## Using Typescript Compiler Directly

This project takes that approach.

https://github.com/electron/electron-quick-start-typescript

Basically, just run the typescript compiler and write .js files to /dist and
then run the app from dist.  This is like webpack but uses the typescript
compiler directly.

### Pros

- no complex electron-compile setup
- I could run mocha and spectron scripts directly

### Cons

- would need good sourcemap integration.

### TODO

- The renderer is now the main problem because I'm loading from an HTTP URL not
  the local filesystem. I might need to use a combination of webpack and
  typescript.  Webpack for my 'apps' and JS for everything else.

- test if module loading and __dirname works if loading from the local FS.

    - it DOES but the relative directory is the loader dir.. NOT the file where
      the script was loaded.

- TODO what prompted this migration... OH!! the issue of web components. If I'm
  still using webpack that might break our migration.  THAT and type safety of
  course.

- see if I can compile directly in the same directory.  this would have the
  downside of leving extra files on disk but it would mean I have to rework a
  lot less code.
    - typescript hides the .js and .js.map files
    - all of my spectron and mocha tests would work I think
    -

# Library resolution issues

https://medium.com/@NetanelBasal/typescript-integrate-jquery-plugin-in-your-project-e28c6887d8dc























