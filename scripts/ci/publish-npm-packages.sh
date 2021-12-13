#!/bin/bash

npm config set always-auth true
source packages/polar-bookshelf-secrets/credentials.sh
rm -f ~/.npmrc && cat .npmrc > ~/.npmrc
pnpm run publish-all
(cd packages/polar-webapp-dist && pnpm run dist)