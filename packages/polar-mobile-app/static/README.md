### Compiling Polar Bookshelf and populating the ./polar folder

Command for bundling Polar Bookshelf and moving the compiled output directly within the React Native app:

```shell
# Build Polar Bookshelf into a directory,
# relative to the mobile app, so the next app bundle
# can pick it up
cd ./packages/polar-bookshelf && \
OUTPUT_PATH=$(pwd)/../../packages/polar-mobile-app3/static/polar \
WEBPACK_BUNDLE=repository \
npx webpack build

# Copy some static assets to suppor the login page
# because of some legacy reasons
cd ../../packages/polar-mobile-app3 && \
cp -R ./static/polar/apps/repository/ \
./static/polar/login
```
