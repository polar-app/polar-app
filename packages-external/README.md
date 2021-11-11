# Overview

These are 'external' package that we don't won't on directly but that we've
forked with small changes we need to work with Polar. Ideally we'd get our
changes accepted upstream but often maintainers take forever to apply PRs.

Additionally, some changes we've made MAY NOT be accepted and maintaining a fork
with a small number of changes isn't difficult.

We give these a special version number and push to our NPM repository.

# Building New Packages and Updating Dependencies

- Change to the directory you want to publish
- Edit package.json to increment the version.
- Run ```npm install``` and then ```npm publish```
- Then you have to change the version of this library in all polar-* packages
- Then run ```lerna bootstrap```
- Then run ```lerna run compile``` to make sure everything builds
- Then verify that CI doesn't have any issues

At that point we should be fine.
