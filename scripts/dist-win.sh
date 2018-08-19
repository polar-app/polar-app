#!/usr/bin/env bash

# TODO- if I can pass a custom artifact name on the command line I could get this to work.

build_for_arch() {
    arch=${1}

    docker run --rm -ti \
       --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
       --env ELECTRON_CACHE="/root/.cache/electron" \
       --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
       -v ${PWD}:/project \
       -v ${PWD##*/}-node-modules:/project/node_modules \
       -v ~/.cache/electron:/root/.cache/electron \
       -v ~/.cache/electron-builder:/root/.cache/electron-builder \
       electronuserland/builder:wine bash -c 'yarn && ./node_modules/.bin/electron-builder --config=electron-builder.yml --config.win.artifactName=\${name}-\${version}-'${arch}'.\${ext} --'${arch}' --win --publish always'

}

build_for_arch x64
build_for_arch ia32
