### Compiling Polar Bookshelf and populating the ./polar folder

Command for bundling Polar Bookshelf and moving the compiled output directly within the React Native app:

```shell
cd ./packages/polar-bookshelf
OUTPUT_PATH=$(pwd)/../../packages/polar-mobile-app3/static/polar WEBPACK_BUNDLE=repository npx webpack build
```
