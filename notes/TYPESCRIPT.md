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
