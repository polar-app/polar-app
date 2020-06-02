# Release Overview

This documents the steps required to perform a release.

MacOS and Linux are required to perform a release.  We can't create DMG files
on Linux.

## MacOS

```npm dist-macos```

## Linux

```npm dist-linux```

# Windows:

Windows builds are still alpha quality as I can't test them.  The builds work
but I need feedback from the community.

## TODO

- clean this up that this is ONE command... and within package.json

## Docs

- https://www.electron.build/multi-platform-build#docker

## Running

```bash
docker run --rm -ti \
   --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
   --env ELECTRON_CACHE="/root/.cache/electron" \
   --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
   -v ${PWD}:/project \
   -v ${PWD##*/}-node-modules:/project/node_modules \
   -v ~/.cache/electron:/root/.cache/electron \
   -v ~/.cache/electron-builder:/root/.cache/electron-builder \
   electronuserland/builder:wine bash -c 'yarn && ./node_modules/.bin/electron-builder --config=electron-builder.yml --win nsis portable --publish always --draft=false'


```

Then within the docker container run:

```bash
yarn && ./node_modules/.bin/electron-builder --config=electron-builder.yml --win nsis portable --publish always --draft=false
```

# Snap Store

- might do this once we have the next stable release.

Create account:

https://snapcraft.io/account

```
  snap install snapcraft
  snapcraft login
  snapcraft push --release stable polar-bookshelf_1.0.0-beta20_amd64.snap

  snapcraft push --release beta polar-bookshelf_1.0.0-beta30_amd64.snap
```

## Install the snap manually to test: 

snap install --dangerous ./dist/polar-bookshelf-1.0.0-beta180-amd64.snap
