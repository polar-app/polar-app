#!/bin/bash

# we have to have this as an isolated script because npm is insanely broken WRT
# npm repositories and we have to exit npm each time we change credentials.

yarn run set-registry-verdaccio &&
yarn run dist-release-webapp-init &&
yarn run set-registry-default-rw &&
yarn run dist-release-webapp-release
