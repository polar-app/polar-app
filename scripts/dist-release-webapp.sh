#!/bin/bash

# we have to have this as an isolated script because npm is insanely broken WRT
# npm repositories and we have to exit npm each time we change credentials.

pnpm run set-registry-verdaccio &&
pnpm run dist-release-webapp-init &&
pnpm run set-registry-default-rw &&
pnpm run dist-release-webapp-release
