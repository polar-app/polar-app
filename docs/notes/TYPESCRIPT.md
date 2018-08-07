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

- It would make it harder for us to port to the web.

- Does not work with our current electron setup (I think this is minimized now)

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

- the problems I'm having could be due to TS 2.0  and could explain why no one
  else has these problems.

    - nope.. my electron-compile-demo uses TS 2.9.2

- try to turn nodeIntegration off

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

nodeIntegration must be true
must be loaded via loadFile
must be loaded via require()




- TODO: I'm kind of stuck now;

    - Electron requires loading from the filesystem to use this easy module
      support.

    - PDF.js WILL NOT work with remote URLs unless I change HOSTED_VIEWER_ORIGINS
      which requires a recompile which would require me to update the app to the
      latest version which is a pain.

    - I could monkey patch HOSTED_VIEWER_ORIGUINS for now... _

    - I could use a BLOB buit I don't want to waste memory when using HUGE PDFs
      but that might actually already be the case...

        - I thnk it MAY be using blobs even for remote URLs...  which if so
          it just makes sense to use blobs anyway.


# NOTES

    - try to migrate most code to

        export default class

        to make imports simplar / cleaner

     - ./node_modules/.bin/dtsmake  -s web/js/Model.js

        works well for creating an initial d.ts file.. might be a good idea to
        go through and create a BUNCH of default which I can tweak once at a
        time.
